"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUpload,
  FiLayers,
  FiFileText,
  FiHelpCircle,
  FiBookmark,
  FiSettings,
  FiFolder,
} from "react-icons/fi";
import { useDocuments } from "../contexts/DocumentContext";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { documents } = useDocuments();

  const mainNavItems: NavItem[] = [
    { name: "Dashboard", href: "/", icon: <FiHome className="w-5 h-5" /> },
    { name: "Upload", href: "/upload", icon: <FiUpload className="w-5 h-5" /> },
    {
      name: "Flashcards",
      href: "/flashcards",
      icon: <FiLayers className="w-5 h-5" />,
      badge: documents.length,
    },
    {
      name: "Summaries",
      href: "/summaries",
      icon: <FiFileText className="w-5 h-5" />,
    },
    { name: "Quiz", href: "/quiz", icon: <FiHelpCircle className="w-5 h-5" /> },
  ];

  const recentDocuments = documents.slice(0, 3).map((doc) => ({
    name: doc.name,
    href: `/document/${doc.id}`,
    icon: <FiFileText className="w-5 h-5" />,
  }));

  const NavItem = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? "bg-indigo-50 text-indigo-600"
            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
        }`}
      >
        {item.icon}
        <span className="ml-3 flex-1">{item.name}</span>
        {item.badge && (
          <span
            className={`ml-auto py-0.5 px-2 rounded-full text-xs ${
              isActive
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg">
            <span className="font-bold">RM</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Revise Master
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>

        {recentDocuments.length > 0 && (
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Recent Documents
            </h3>
            <div className="mt-2 space-y-1">
              {recentDocuments.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Collections
          </h3>
          <div className="mt-2 space-y-1">
            <NavItem
              item={{
                name: "My Documents",
                href: "/documents",
                icon: <FiFolder className="w-5 h-5" />,
                badge: documents.length,
              }}
            />
            <NavItem
              item={{
                name: "Saved",
                href: "/saved",
                icon: <FiBookmark className="w-5 h-5" />,
              }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Link
          href="/settings"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-indigo-600"
        >
          <FiSettings className="w-5 h-5" />
          <span className="ml-3">Settings</span>
        </Link>
      </div>
    </div>
  );
}
