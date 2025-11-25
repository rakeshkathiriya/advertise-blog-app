import { useCallback, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import FlipBookPage from './FlipBookPage';

const InteractiveFlipBook: React.FC = () => {
  // Refs
  const flipBookRef = useRef<any>(null);

  // States
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [isShowCover, setIsShowCover] = useState<boolean>(true);

  // Navigate to next page
  const handleNextPageClick = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  }, []);

  // Navigate to previous page
  const handlePreviousPageClick = useCallback(() => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  }, []);

  // Handle page flip event
  const handlePageFlip = useCallback((e: any) => {
    setCurrentPageNumber(e.data + 1);
  }, []);

  // Handle flip_book initialization
  const handleFlipBookInit = useCallback((e: any) => {
    // Get total pages
    if (e && e.data) {
      const totalPages = e.data.getPageCount();
      setTotalPageCount(totalPages);
    }
  }, []);

  // Get total page count after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (flipBookRef.current) {
        try {
          const flipBook = flipBookRef.current.pageFlip();
          const count = flipBook.getPageCount();
          setTotalPageCount(count / 2);
        } catch (error) {
          console.error('Error getting page count:', error);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowCover(false);
      // Keep the book on the first page after cover is hidden
      if (flipBookRef.current) {
        try {
          const flipBookInstance = flipBookRef.current.pageFlip();
          flipBookInstance.flip(1); // Go to page 0 (first page)
        } catch (error) {
          console.error('Error flipping to first page:', error);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex w-screen flex-col items-center justify-center overflow-hidden! bg-gray-700 py-10">
      <HTMLFlipBook
        {...({
          width: 500,
          height: 750,
          size: 'fixed',
          maxWidth: '100%',
          maxHeight: '100%',
          maxShadowOpacity: 0.5,
          drawShadow: true,
          showCover: isShowCover,
          flippingTime: 1000,
          mobileScrollSupport: true,
          onInit: handleFlipBookInit,
          onFlip: handlePageFlip,
          ref: flipBookRef,
        } as any)}
      >
        {photoGalleryPages.map((book) => (
          <div className="flex h-full w-full items-center justify-center bg-white bg-cover p-5 text-center">
            <FlipBookPage key={book.id} imageUrl={book.imageUrl} altText={book.altText} />
          </div>
        ))}
      </HTMLFlipBook>

      <div className="flex w-full max-w-md flex-col items-center justify-center p-5 text-white">
        <div className="space-x-3">
          <button
            onClick={handlePreviousPageClick}
            className="cursor-pointer bg-white p-5 text-center text-black"
            aria-label="Go to previous page"
          >
            Previous page
          </button>
          [<span>{currentPageNumber}</span> of <span>{totalPageCount}</span>]
          <button
            onClick={handleNextPageClick}
            className="cursor-pointer bg-white p-5 text-center text-black"
            aria-label="Go to next page"
          >
            Next page
          </button>
        </div>
      </div>
    </div>
  );
};

const photoGalleryPages = [
  {
    id: 1,
    imageUrl:
      'https://plus.unsplash.com/premium_photo-1713820011044-94a0d803b0f6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altText: '',
  },
  {
    id: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1553096442-8fe2118fb927?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altText: '',
  },
  {
    id: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1580130857334-2f9b6d01d99d?q=80&w=732&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altText: '',
  },
  {
    id: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1579677917230-8a938ffc0279?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altText: '',
  },
  {
    id: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1601539198710-3ae01f7b9fe1?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altText: '',
  },
  {
    id: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1582148818753-2b63c7785867?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    altText: '',
  },
];

export default InteractiveFlipBook;
