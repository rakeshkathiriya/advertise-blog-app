import { useCallback, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useGetAllAdvertise } from '../../queries/adminPanel/advertise.query';
import FlipBookPage from './FlipBookPage';

const InteractiveFlipBook: React.FC = () => {
  const { data: adResponse, isLoading, isError } = useGetAllAdvertise();
  const flipBookRef = useRef<any>(null);

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [isShowCover, setIsShowCover] = useState(true);

  const handleNextPageClick = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipNext();
  }, []);

  const handlePreviousPageClick = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const handlePageFlip = useCallback((e: any) => {
    setCurrentPageNumber(e.data + 1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowCover(false);
      flipBookRef.current?.pageFlip()?.flip(1);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex w-screen flex-col items-center justify-center bg-gray-700 py-10">
      {/* LEFT BUTTON */}

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
          onInit: handlePageFlip,
          onFlip: handlePageFlip,
          ref: flipBookRef,
        } as any)}
      >
        {(adResponse?.data ?? []).map((book) => (
          <div key={book._id} className="flex h-full w-full items-center justify-center overflow-hidden bg-white p-5">
            <FlipBookPage imageUrl={book.image} altText={'image'} />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default InteractiveFlipBook;
