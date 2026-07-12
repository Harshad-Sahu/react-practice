export const initialTree = [
  {
    id: "1",
    name: "Root",
    type: "folder",
    children: [
      {
        id: "2",
        name: "File1.txt",
        type: "file",
      },
      {
        id: "3",
        name: "Child Folder",
        type: "folder",
        children: [
          {
            id: "4",
            name: "File2.txt",
            type: "file",
          },
        ],
      },
    ],
  },
];

export const RICK_AND_MORTY_API_URL =
  "https://rickandmortyapi.com/api/character";

export const RICK_AND_MORTY_STATUS_OPTIONS = [
  "All",
  "Alive",
  "Dead",
  "unknown",
];

export const RICK_AND_MORTY_SORT_OPTIONS = [
  {
    id: 1,
    value: "",
    label: "Default",
  },
  {
    id: 2,
    value: "asc",
    label: "Sort A-Z",
  },
  {
    id: 3,
    value: "desc",
    label: "Sort Z-A",
  },
];
