import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Facebook, Instagram, Lock } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAllAdvertise } from '../../queries/adminPanel/advertise.query';
import { freePageCount } from '../../utils/constants';
import { isUserForeverSubscribed } from '../../utils/helper';
import { Spinner } from '../common/Spinner';
import FlipBookPage from './FlipBookPage';

const InteractiveFlipBook: React.FC = () => {
  const navigate = useNavigate();
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [isShowCover, setIsShowCover] = useState(true);
  const isForeverSubscribe = isUserForeverSubscribed();

  const flipBookRef = useRef<any>(null);

  const { data: adResponse, isLoading } = useGetAllAdvertise();

  const flipRight = useCallback(() => {
    const nextPage = currentPageNumber + 1;
    if (!isForeverSubscribe && nextPage > freePageCount) {
      setCurrentPageNumber(nextPage);
      return;
    }
    flipBookRef.current?.pageFlip()?.flipNext();
  }, [currentPageNumber, isForeverSubscribe]);

  const flipLeft = useCallback(() => {
    const prevPage = currentPageNumber - 1;
    if (prevPage >= 0) {
      setCurrentPageNumber(prevPage);
    }
    flipBookRef.current?.pageFlip()?.flipPrev();
  }, [currentPageNumber]);

  const handlePageFlip = useCallback(
    (e: any) => {
      const nextPage = e.data + 1;
      if (!isForeverSubscribe && nextPage > freePageCount) {
        setCurrentPageNumber(nextPage);
        return;
      }
      setCurrentPageNumber(nextPage);
    },
    [isForeverSubscribe],
  );

  useEffect(() => {
    if (!isLoading && adResponse?.data) {
      setIsShowCover(true);
      const timer = setTimeout(() => {
        setIsShowCover(false);
        flipBookRef.current?.pageFlip()?.flip(1);
        setCurrentPageNumber(1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, adResponse]);

  const isOnRestrictedPage = !isForeverSubscribe && currentPageNumber > freePageCount;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex min-h-screen w-screen flex-col items-center justify-center py-10 select-none"
    >
      {isLoading && <Spinner className="bg-transparent! backdrop-blur-none!" />}

      <AnimatePresence>
        {!isLoading && isOnRestrictedPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 flex h-full w-full flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 text-center"
            >
              <Lock size={64} className="mx-auto text-gray-400" />
              <h1 className="text-3xl font-bold text-gray-800">Subscribe to Continue</h1>
              <p className="text-lg text-gray-600">Unlock full access to all pages</p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/pricingPlan')}
                className="bg-bgPrimary hover:bg-bgPrimaryDark mt-4 cursor-pointer rounded-lg px-8 py-3 font-semibold text-white shadow-lg transition-colors"
              >
                Choose a Plan
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && !isOnRestrictedPage && (
        <>
          {/* Left Arrow */}
          {currentPageNumber > 1 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-[50%] left-0.5 z-10 -translate-y-1/2 md:left-[calc(50%-370px)] lg:left-[calc(50%-500px)]"
            >
              <ChevronLeft
                onClick={flipLeft}
                className="bg-bgPrimary/30 h-6 w-6 cursor-pointer rounded-full p-1 md:h-[35px] md:w-[35px]"
              />
            </motion.div>
          )}

          {/* Right Arrow */}
          {currentPageNumber < (adResponse?.data?.length || 0) + 2 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute top-[50%] right-0.5 z-10 -translate-y-1/2 md:right-[calc(50%-370px)] lg:right-[calc(50%-500px)]"
            >
              <ChevronRight
                onClick={flipRight}
                className="bg-bgPrimary/30 h-6 w-6 cursor-pointer rounded-full p-1 md:h-[35px] md:w-[35px]"
              />
            </motion.div>
          )}

          <HTMLFlipBook
            {...({
              Key: 'flipBook',
              width: 500,
              height: 700,
              size: 'stretch',
              minWidth: 250,
              maxWidth: 500,
              minHeight: 350,
              maxHeight: 900,
              maxShadowOpacity: 0.5,
              drawShadow: true,
              showCover: isShowCover,
              flippingTime: 1000,
              mobileScrollSupport: true,
              onInit: handlePageFlip,
              onFlip: handlePageFlip,
              ref: flipBookRef,
              startPage: currentPageNumber,
              swipeDistance: 10,
              useMouseEvents: false,
              clickEventForward: true,
              disableFlipByClick: false,

              usePortrait: true,
            } as any)}
          >
            {/* ======================= COVER PAGE ======================= */}
            <div key="cover-page" className="relative flex">
              <div className="page bg-bgDefault border-borderMedium flex h-full w-full flex-col items-center justify-between overflow-hidden border p-4">
                <FlipBookPage imageUrl="/first.png" altText="image" />
                <PageFooter index={0} fbPostLink="" igPostLink="" isShowPage={false} isShowIcon={false} />
              </div>
            </div>

            {/* ======================= MAIN PAGES ======================= */}
            {adResponse &&
              (adResponse?.data ?? []).map((book, index) => (
                <div className="relative flex" key={book._id}>
                  <div className="page bg-bgDefault border-borderMedium flex h-full w-full flex-col items-center justify-between overflow-hidden border p-4">
                    <FlipBookPage imageUrl={book.image} altText="image" />
                    <PageFooter index={index} fbPostLink={book?.fbPostLink ?? ''} igPostLink={book?.igPostLink ?? ''} />
                  </div>
                </div>
              ))}

            {/* Extra filler page for odd page count */}
            {adResponse && adResponse.data.length % 2 !== 0 ? (
              <div key={'second-last-page'} className="relative flex">
                <div className="page bg-bgDefault border-borderMedium flex h-full w-full flex-col justify-end overflow-hidden border p-4">
                  <PageFooter
                    index={adResponse?.data.length}
                    fbPostLink=""
                    igPostLink=""
                    isShowPage={true}
                    isShowIcon={false}
                  />
                </div>
              </div>
            ) : null}

            {/* ======================= LAST PAGE ======================= */}
            <div key="last-page" className="relative flex">
              <div className="page bg-bgDefault border-borderMedium flex h-full w-full flex-col items-center justify-between overflow-hidden border p-4">
                <FlipBookPage imageUrl="/Last.png" altText="image" />
                <PageFooter index={0} fbPostLink="" igPostLink="" isShowPage={false} isShowIcon={false} />
              </div>
            </div>
          </HTMLFlipBook>
        </>
      )}
    </motion.div>
  );
};

/* ======================= Footer Component ======================= */

const PageFooter = ({
  index,
  fbPostLink,
  igPostLink,
  isShowPage = true,
  isShowIcon = true,
}: {
  index: number;
  fbPostLink: string;
  igPostLink: string;
  isShowPage?: boolean;
  isShowIcon?: boolean;
}) => {
  return (
    <div className="flex min-h-[30px] w-full items-center justify-center">
      {isShowIcon && (
        <div className="text-textSecondary/50 flex cursor-pointer items-center justify-center gap-3">
          {fbPostLink && (
            <Link to={fbPostLink} target="_blank">
              <Facebook className="h-[15px] w-[15px] md:h-5 md:w-5" color="#4B556380" strokeWidth={2.5} />
            </Link>
          )}
          {igPostLink && (
            <Link to={igPostLink} target="_blank">
              <Instagram className="h-[15px] w-[15px] md:h-5 md:w-5" color="#4B556380" strokeWidth={2.5} />
            </Link>
          )}
        </div>
      )}

      {isShowPage && (
        <div className="flex w-[45%]">
          <p className="text-textSecondary/50 ml-auto text-xs font-semibold md:text-sm">{'Page ' + (index + 1)}</p>
        </div>
      )}

      <h4 className="text-textSecondary/50 ml-auto text-xs font-semibold md:text-sm">Food N Processing</h4>
    </div>
  );
};

export default InteractiveFlipBook;
