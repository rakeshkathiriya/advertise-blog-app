import { useCallback, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useGetAllAdvertise } from '../../queries/adminPanel/clients.query';
import FlipBookPage from './FlipBookPage';

const InteractiveFlipBook: React.FC = () => {
  const { data: adResponse, isLoading, isError, refetch } = useGetAllAdvertise();
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
        {(adResponse?.data ?? []).map((book) => (
          <div className="flex h-full w-full items-center justify-center bg-white bg-cover p-5 text-center">
            <FlipBookPage key={book._id} imageUrl={book.image} altText={'image'} />
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
          [<span>{currentPageNumber}</span> of <span>{adResponse?.data.length}</span>]
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

export default InteractiveFlipBook;
