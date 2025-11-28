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
      <div className="flex min-h-screen w-screen items-center justify-center">
        <div className="text-textPrimary">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center">
        <div className="text-textPrimary">Error loading advertisements</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center justify-center py-10">
      <HTMLFlipBook
        {...({
          Key: 'flipBokk',
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
          startPage: 0,
          swipeDistance: 10,
        } as any)}
      >
        <div
          key="cover-page"
          className="page bg-bgDefault border-borderMedium flex h-full w-full flex-col items-center justify-center overflow-hidden border px-3! py-4!"
        >
          <FlipBookPage imageUrl={'/first.png'} altText={'image'} />
          <div className="pagefooter h-[50px] w-full">
            <h4>© Smart Book 2025</h4>
          </div>
        </div>

        {(adResponse?.data ?? []).map((book, index) => (
          <div
            key={book._id}
            className="page bg-bgDefault border-borderMedium flex h-full w-full flex-col items-center justify-center overflow-hidden border px-3! py-4!"
          >
            <FlipBookPage imageUrl={book.image} altText={'image'} />
            <div className="pagefooter h-[50px] w-full">
              <div className="pgfoter-div">
                <p>{'Page ' + (index + 1)} </p>
              </div>
              <h4>© Smart Book 2025</h4>
            </div>
          </div>
        ))}

        <div
          key="last-page"
          className="page bg-bgDefault border-borderMedium flex h-full w-full flex-col items-center justify-center overflow-hidden border px-3! py-4!"
        >
          <FlipBookPage imageUrl={'/Last.png'} altText={'image'} />
          <div className="pagefooter h-[50px] w-full">
            <h4>© Smart Book 2025</h4>
          </div>
        </div>
      </HTMLFlipBook>
    </div>
  );
};
export default InteractiveFlipBook;
