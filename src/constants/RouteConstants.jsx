import React from "react";
import InterviewQuestionsMainPage from "../domains/home/InterviewQuestionsMainPage";
import * as GFE_COMPONENT from "../domains/InterviewGreatFrontend";
import * as NAMASTE_COMPONENT from "../domains/InterviewNamasteReact";
import { initialTree } from "./InterviewNamasteReactConstants/constant";

export const MainRoutes = [
  {
    path: "/interview-great-frontend",
    label: "Great Frontend Interview Questions",
    element: <InterviewQuestionsMainPage />,
  },
  {
    path: "/interview-namaste-react",
    label: "Namaste React Interview Questions",
    element: <InterviewQuestionsMainPage />,
  },
];

// Add new entries here and they automatically show up in the nav list below.
export const Routes_GFE = [
  {
    path: "/react18",
    label: "React 18 — API FETCH - useEffect + useState",
    element: <GFE_COMPONENT.PostsGridReact18 />,
  },
  {
    path: "/react19",
    label: "React 19 — API FETCH -use() hook + Suspense",
    element: <GFE_COMPONENT.PostsGridReact19 />,
  },
  {
    path: "/form-basic",
    label: "Basic form - REACT 18",
    element: <GFE_COMPONENT.RegistrationForm />,
  },
  {
    path: "/todo",
    label: "Basic Todo List - EASY",
    element: <GFE_COMPONENT.TodoListOne />,
  },
  {
    path: "/accordion-basic",
    label: "Basic Accordion - EASY",
    element: <GFE_COMPONENT.Accordion />,
  },
  {
    path: "/progress-bar",
    label: "Basic Progress Bar - EASY",
    element: <GFE_COMPONENT.ProgressBar />,
  },
  {
    path: "/mortgage-calculator",
    label: "Mortgage Calculator",
    element: <GFE_COMPONENT.MortgageCalculator />,
  },
  {
    path: "/progress-bar-with-percentage",
    label: "Progress Bar with Percentage",
    element: <GFE_COMPONENT.ProgressBarWithPercentage />,
  },
  {
    path: "/temperature-convertor",
    label: "Temperature Convertor",
    element: <GFE_COMPONENT.TemperatureConvertor />,
  },
];

export const Routes_NamasteReact = [
  {
    path: "/dynamic-greeting",
    label: "Dynamic Greeting App",
    element: <NAMASTE_COMPONENT.DynamicGreetingApp />,
  },
  {
    path: "/resizeable-split-panel",
    label: "Resizeable Split Panel",
    element: <NAMASTE_COMPONENT.ResizeableSplitPanel />,
  },
  {
    path: "/tab-component",
    label: "Tab Component",
    element: <NAMASTE_COMPONENT.TabComponent />,
  },
  {
    path: "/grid-lights",
    label: "Grid Lights",
    element: (
      <NAMASTE_COMPONENT.GridLights
        gridSize={Math.floor(Math.random() * 5) + 3}
      />
    ),
  },
  {
    path: "/traffic-light",
    label: "Traffic Light",
    element: <NAMASTE_COMPONENT.TrafficLight />,
  },
  {
    path: "/kanban-board",
    label: "Kanban Board",
    element: <NAMASTE_COMPONENT.KanbanBoard />,
  },
  {
    path: "/tree-navigation",
    label: "Tree Navigation",
    element: <NAMASTE_COMPONENT.TreeNavigation tree={initialTree} />,
  },
  {
    path: "/rick-and-morty",
    label: "Rick & Morty",
    element: <NAMASTE_COMPONENT.RickAndMortyCharacters />,
  },
  {
    path: "/file-explorer",
    label: "VS CODE - File Explorer",
    element: <NAMASTE_COMPONENT.VSCodeFileExplorer />,
  },
  {
    path: "/infinite-scroll",
    label: "Infinite Scroll - Rick & Morty",
    element: <NAMASTE_COMPONENT.InfiniteScroll />,
  },
];
