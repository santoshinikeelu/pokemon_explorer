"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
}

export function Pagination({ totalItems, pageSize, currentPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    
    router.push(`/?${params.toString()}`);
  };
  
  const getPageNumbers = () => {
    const pages = [];
    
    pages.push(1);
    
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    if (rangeEnd - rangeStart < 2) {
      if (rangeStart === 2) {
        rangeEnd = Math.min(4, totalPages - 1);
      } else if (rangeEnd === totalPages - 1) {
        rangeStart = Math.max(2, totalPages - 3);
      }
    }
    
    if (rangeStart > 2) {
      pages.push(-1); 
    }
    
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    if (rangeEnd < totalPages - 1) {
      pages.push(-2); 
    }
    
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center space-x-2 py-8">
     <button
  onClick={() => handlePageChange(currentPage - 1)}
  disabled={currentPage === 1}
  className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
>
  <ChevronLeft className="h-4 w-4" />
  <span className="sr-only">Previous page</span>
</button>

      
      {pageNumbers.map((page, i) => {
        if (page < 0) {
          return (
            <button
            key={`ellipsis-${i}`}
            disabled
            className="p-2 rounded-md text-gray-500 cursor-not-allowed"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More pages</span>
          </button>
          
          );
        }
        
        return (
          <button
  key={page}
  onClick={() => handlePageChange(page)}
  className={`px-4 py-2 rounded-md border transition ${
    currentPage === page
      ? "bg-gray-900 text-white border-gray-900"
      : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
  } hidden sm:inline-flex`}
>
  {page}
</button>

        );
      })}
      
      <div className="sm:hidden">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      
      <button
  onClick={() => handlePageChange(currentPage + 1)}
  disabled={currentPage === totalPages}
  className={`p-2 rounded-md border transition ${
    currentPage === totalPages
      ? "cursor-not-allowed opacity-50 border-gray-300"
      : "border-gray-300 hover:bg-gray-100"
  }`}
>
  <ChevronRight className="h-4 w-4" />
  <span className="sr-only">Next page</span>
</button>

    </div>
  );
}