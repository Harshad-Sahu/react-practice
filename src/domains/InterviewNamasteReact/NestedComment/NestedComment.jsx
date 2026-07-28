/* eslint-disable react/prop-types */
import React, { useCallback, useState } from "react";
import "./NestedComment.css";

// ---------------------------------------------------------------------------
// Domain shape (documented in comments since this is plain JS, not TS):
//
// Comment = {
//   id: string,          // crypto.randomUUID() - see note below
//   author: string,
//   text: string,
//   createdAt: string,   // ISO timestamp
//   collapsed: boolean,  // UI state: are this comment's replies hidden?
//   replies: Comment[],  // recursive - a comment tree is just nested arrays
// }
//
// Why crypto.randomUUID() instead of an incrementing counter or array index:
// 1. It's collision-resistant across the whole tree without a global counter
//    threaded through every insert call.
// 2. Using array *index* as a React key is the classic footgun here - once
//    you can delete/reorder nodes at arbitrary depths, index-as-key causes
//    React to reuse the wrong DOM node (and the wrong local state, e.g. an
//    open "reply" textbox) for a different comment after a deletion.
//    A stable, content-independent id sidesteps that entirely.
// ---------------------------------------------------------------------------

const createComment = (author, text, replies = []) => ({
  id: crypto.randomUUID(),
  author,
  text,
  createdAt: new Date().toISOString(),
  collapsed: false,
  replies,
});

// Seed data so the tree isn't empty on first render.
const INITIAL_COMMENTS = [
  createComment("Ava", "This pattern generalizes really well to a file explorer tree too.", [
    createComment("Ben", "Right - same recursive map/filter, different node shape."),
  ]),
  createComment("Priya", "Nice use of crypto.randomUUID() for keys instead of array index."),
];

// ---------------------------------------------------------------------------
// Pure tree-manipulation helpers.
//
// These are deliberately kept OUTSIDE any component and free of side effects:
// given the same tree + arguments, they always return the same result, and
// they never mutate their input. That's what makes them trivially reusable
// (DRY) and testable in isolation - a pure function is the easiest unit in
// the whole file to unit-test without rendering anything.
// ---------------------------------------------------------------------------

/**
 * Walks the tree looking for the node with `targetId`. When found, replaces
 * it with `transform(node)`. Every ancestor on the path back to the root is
 * shallow-copied (new object/array references) so React's reference-equality
 * checks correctly see the branch as changed - while every UNTOUCHED sibling
 * subtree keeps its exact original reference. That's the whole point of an
 * immutable recursive update: React (or React.memo below) can skip re-
 * rendering any branch that didn't change, just by comparing props.comment
 * with ===.
 *
 * This single helper is reused for BOTH "add a reply" and "toggle collapse"
 * below - the only thing that differs between those two operations is the
 * `transform` function, which is exactly the kind of duplication a small
 * strategy-function parameter is meant to eliminate (DRY, open/closed: new
 * "find node and replace it" operations don't require touching this code).
 */
const updateCommentTree = (comments, targetId, transform) =>
  comments.map((comment) => {
    if (comment.id === targetId) {
      return transform(comment);
    }
    if (comment.replies.length === 0) {
      return comment; // no matching descendant possible - reuse original reference
    }
    return {
      ...comment,
      replies: updateCommentTree(comment.replies, targetId, transform),
    };
  });

/**
 * Recursive filter: removes the node with `targetId` at whichever depth it
 * lives, and implicitly removes its entire subtree with it (its replies
 * array is simply never visited once the parent itself is filtered out).
 * Every level not containing the target is still rebuilt with a fresh
 * `replies` array (immutability), but nodes with no matching descendant
 * short-circuit and reuse their original reference, same as above.
 */
const deleteCommentFromTree = (comments, targetId) =>
  comments
    .filter((comment) => comment.id !== targetId)
    .map((comment) =>
      comment.replies.length === 0
        ? comment
        : { ...comment, replies: deleteCommentFromTree(comment.replies, targetId) }
    );

/** Counts every descendant (not just direct replies) - used for the collapsed-thread badge. */
const countDescendants = (comment) =>
  comment.replies.reduce((total, reply) => total + 1 + countDescendants(reply), 0);

const formatRelativeTime = (isoString) => {
  const diffMinutes = Math.round((Date.now() - new Date(isoString).getTime()) / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
};

// ---------------------------------------------------------------------------
// CommentForm - a single reusable form for both "write a new top-level
// comment" and "reply to comment X". It only knows how to collect text and
// call back with it; it has no idea whether that becomes a root comment or
// a nested reply. That separation of concerns is what lets the exact same
// component serve both call sites (SOLID: single responsibility + DRY).
// ---------------------------------------------------------------------------
const CommentForm = ({ onSubmit, placeholder, submitLabel, onCancel, autoFocus }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        className="comment-form__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={2}
        autoFocus={autoFocus}
      />
      <div className="comment-form__actions">
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn--primary" disabled={!text.trim()}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

// ---------------------------------------------------------------------------
// Comment - the recursive unit. It renders itself, then maps over its own
// `replies` and renders one <Comment> per reply. That map call is the
// entire "tree renderer" - no separate recursive-descent function needed,
// because JSX + a component calling itself IS the recursion.
//
// Wrapped in React.memo: since updateCommentTree/deleteCommentFromTree
// return new references only along the path to the changed node, a sibling
// branch's `comment` prop is reference-identical across re-renders and
// React.memo lets that entire subtree skip re-rendering.
// ---------------------------------------------------------------------------
const Comment = React.memo(function Comment({
  comment,
  onReply,
  onDelete,
  onToggleCollapse,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const hasReplies = comment.replies.length > 0;

  const handleReplySubmit = (text) => {
    onReply(comment.id, text);
    setIsReplying(false); // collapse the form once the reply is sent
  };

  return (
    <li className="comment">
      <div className="comment__card">
        <div className="comment__header">
          <span className="comment__avatar" aria-hidden="true">
            {comment.author.charAt(0).toUpperCase()}
          </span>
          <span className="comment__author">{comment.author}</span>
          <span className="comment__time">{formatRelativeTime(comment.createdAt)}</span>
        </div>

        <p className="comment__text">{comment.text}</p>

        <div className="comment__actions">
          <button
            type="button"
            className="comment__action-btn"
            onClick={() => setIsReplying((prev) => !prev)}
          >
            {isReplying ? "Cancel" : "Reply"}
          </button>

          {hasReplies && (
            <button
              type="button"
              className="comment__action-btn"
              onClick={() => onToggleCollapse(comment.id)}
            >
              {comment.collapsed
                ? `Show ${countDescendants(comment)} repl${countDescendants(comment) === 1 ? "y" : "ies"}`
                : "Hide replies"}
            </button>
          )}

          <button
            type="button"
            className="comment__action-btn comment__action-btn--danger"
            onClick={() => onDelete(comment.id)}
          >
            Delete
          </button>
        </div>

        {isReplying && (
          <CommentForm
            onSubmit={handleReplySubmit}
            onCancel={() => setIsReplying(false)}
            placeholder={`Replying to ${comment.author}…`}
            submitLabel="Reply"
            autoFocus
          />
        )}
      </div>

      {/* Recursive step: each reply is rendered by the SAME Comment component. */}
      {hasReplies && !comment.collapsed && (
        <ul className="comment__replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onToggleCollapse={onToggleCollapse}
            />
          ))}
        </ul>
      )}
    </li>
  );
});

// ---------------------------------------------------------------------------
// NestedComment - the state owner. This is the ONLY place `comments` state
// lives (single source of truth); every <Comment> below is purely
// presentational plus local UI state (its own isReplying toggle). That
// split is what keeps the recursive component simple: it never has to know
// how to find-or-mutate the tree itself, it just calls the handlers passed
// down from here.
// ---------------------------------------------------------------------------
const NestedComment = () => {
  const [comments, setComments] = useState(INITIAL_COMMENTS);

  // Every handler uses the functional setState form (prev => ...) instead of
  // closing over `comments` directly. That means these callbacks never need
  // `comments` in their dependency array, so useCallback(..., []) gives them
  // a stable identity for the entire component's lifetime - which in turn is
  // what lets React.memo on <Comment> actually skip re-rendering untouched
  // branches (a callback prop that changed identity every render would defeat
  // memoization even if `comment` itself didn't change).
  const handleAddRootComment = useCallback((text) => {
    setComments((prev) => [...prev, createComment("You", text)]);
  }, []);

  const handleReply = useCallback((parentId, text) => {
    setComments((prev) =>
      updateCommentTree(prev, parentId, (comment) => ({
        ...comment,
        collapsed: false, // auto-expand so the new reply is immediately visible
        replies: [...comment.replies, createComment("You", text)],
      }))
    );
  }, []);

  const handleDelete = useCallback((commentId) => {
    setComments((prev) => deleteCommentFromTree(prev, commentId));
  }, []);

  const handleToggleCollapse = useCallback((commentId) => {
    setComments((prev) =>
      updateCommentTree(prev, commentId, (comment) => ({
        ...comment,
        collapsed: !comment.collapsed,
      }))
    );
  }, []);

  return (
    <div className="nested-comments">
      <h2 className="nested-comments__title">Discussion</h2>

      <CommentForm
        onSubmit={handleAddRootComment}
        placeholder="Add a comment…"
        submitLabel="Comment"
      />

      {comments.length === 0 ? (
        <p className="nested-comments__empty">No comments yet. Be the first to write one.</p>
      ) : (
        <ul className="comment__replies comment__replies--root">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
              onToggleCollapse={handleToggleCollapse}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default NestedComment;
