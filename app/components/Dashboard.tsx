"use client";

import { useState } from "react";
import { Tab } from "@headlessui/react";
import { FiPlus, FiFilter } from "react-icons/fi";
import FileExplorer from "./FileExplorer";
import Flashcards from "./Flashcards";
import Summary from "./Summary";
import Quiz from "./Quiz";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    {
      name: "File Explorer",
      component: <FileExplorer onDocumentSelect={() => {}} />,
    },
    {
      name: "Flashcards",
      component: <Flashcards documentId={null} />,
    },
    {
      name: "Summary",
      component: <Summary documentId={null} />,
    },
    {
      name: "Quiz",
      component: <Quiz documentId={null} />,
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Study Materials
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and study your documents
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <FiFilter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <FiPlus className="w-4 h-4 mr-2" />
              Add Document
            </button>
          </div>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-2 rounded-xl bg-white p-1 border border-gray-200">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                    selected
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            {tabs.map((tab, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  "rounded-xl bg-white p-4 shadow-sm border border-gray-200",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500"
                )}
              >
                {tab.component}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
