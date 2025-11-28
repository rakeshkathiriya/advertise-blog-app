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
    if (!isLoading && adResponse?.data) {
      const timer = setTimeout(() => {
        setIsShowCover(false);
        flipBookRef.current?.pageFlip()?.flip(1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, adResponse]);

  // Don't render until data is loaded
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-gray-700">
        <div>Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-gray-700">
        <div>Error loading advertisements</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center justify-center bg-gray-700 py-10">
      <HTMLFlipBook
        {...({
          width: 500,
          height: 750,
          size: 'fixed',
          maxWidth: '100%',
          minHeight: '100vh',
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
        <div key="cover-page">
          <div className="flex h-full w-full items-center justify-center overflow-hidden bg-white p-5">
            <FlipBookPage imageUrl={'/first.png'} altText={'image'} />
          </div>
        </div>
        {(adResponse?.data ?? []).map((book) => (
          <div key={book._id} className="flex h-full w-full items-center justify-center overflow-hidden bg-white p-5">
            <FlipBookPage imageUrl={book.image} altText={'image'} />
          </div>
        ))}
        <div key="last-page">
          <div className="flex h-full w-full items-center justify-center overflow-hidden bg-white p-5">
            <FlipBookPage imageUrl={'/Last.png'} altText={'image'} />
          </div>
        </div>
      </HTMLFlipBook>
    </div>
  );
};
export default InteractiveFlipBook;
