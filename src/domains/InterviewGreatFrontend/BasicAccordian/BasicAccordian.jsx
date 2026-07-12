import { useState } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";


const accordionItems = [
  {
    title: "HTML",
    content:
      "The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser.",
  },
  {
    title: "CSS",
    content:
      "Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML.",
  },
  {
    title: "JavaScript",
    content:
      "JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.",
  },
];

export default function Accordion() {
  const [expanded, setExpanded] = useState(
    new Array(accordionItems.length).fill(false),
  );

  const handleAccordionToggle = (accordionIndex) => {
    console.log(accordionIndex);
    setExpanded((prev) =>
      prev?.map((item, index) => {
        return accordionIndex === index ? !item : item;
      }),
    );
  };

  return (
    <div>
      {accordionItems?.map((item, index) => {
        return (
          <div key={`accordion-item-${index}`} style={{ margin: "1rem 0" }}>
            <div onClick={() => handleAccordionToggle(index)} style={{ display: "flex" }}>
              {item.title}
              <div style={{ margin: "0 1rem 0 0.5rem" }}>
              {expanded[index] ? <SlArrowUp /> : <SlArrowDown />}
              </div>
            </div>
            {expanded[index] && <div>{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
