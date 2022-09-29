import { useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import useResponsive from '@/common/hooks/useResponsive';
import { getCookie, setCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { SearchBar } from '../../components/suggestion/searchBar';
import { useSearchStore } from '../../store/search';
const SuggestionCentent = dynamic(() => import('../../components/suggestion/suggestionCentent'));

export const Suggestion = () => {
  const [isOpenSuggestion, setIsShouldOpen] = useState(false);
  const { isMobile } = useResponsive();
  const userSearchValue = useSearchStore(state => state.userSearchValue);
  const city = useSearchStore(state => state.city);
  const setCity = useSearchStore(state => state.setCity);
  const searchSuggestion = useSearchSuggestion(
    {
      query: userSearchValue,
      ...(city.id !== '-1' && { city_id: city.id }),
    },
    {
      keepPreviousData: true,
    },
  );
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, () => !isMobile && setIsShouldOpen(false));

  const openSuggestionContent = () => {
    setIsShouldOpen(true);
  };

  const clickBackButton = () => {
    setIsShouldOpen(false);
  };

  useEffect(() => {
    try {
      const getCityInCookie = JSON.parse(getCookie('new-city') as string);
      if (getCityInCookie) {
        setCity({
          ...getCityInCookie,
        });
      }
    } catch (error) {
      return;
    }
  }, []);

  useEffect(() => {
    if (userSearchValue) {
      openSuggestionContent();
    }
    setCookie('new-city', city);
  }, [userSearchValue, city]);

  useEffect(() => {
    if (isOpenSuggestion && isMobile) {
      neutralizeBack();
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      if (isMobile) {
        window.onpopstate = () => {
          return;
        };
      }
    }
  }, [isOpenSuggestion, isMobile]);

  const handleClose = () => {
    setIsShouldOpen(false);
  };

  const neutralizeBack = () => {
    if (isMobile) {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = () => {
        window.onpopstate = () => {
          return;
        };
        handleClose();
      };
    }
  };

  const handleRedirectToSearch = (text: string) => {
    location.assign(`/s/${city?.en_slug}/?text=${text ?? ''}`);
  };

  const suggestionItems = useMemo(() => searchSuggestion.data?.data ?? [], [searchSuggestion.data]);

  return (
    <div className="w-full lg:w-[50rem] relative" ref={ref}>
      <SearchBar
        isOpenSuggestion={isOpenSuggestion}
        onClickSearchInput={openSuggestionContent}
        onClickBackButton={clickBackButton}
        onEnter={handleRedirectToSearch}
        className={{
          'rounded-br-none rounded-bl-none rounded-tr-3xl rounded-tl-3xl border-transparent': isOpenSuggestion,
          'hover:md:shadow-lg': !isOpenSuggestion,
        }}
      />
      {isOpenSuggestion && (
        <SuggestionCentent
          searchInput={
            isMobile ? (
              <SearchBar
                onEnter={handleRedirectToSearch}
                isOpenSuggestion={isOpenSuggestion}
                onClickBackButton={clickBackButton}
                className="!border-primary"
              />
            ) : undefined
          }
          items={suggestionItems}
          className="shadow-md"
        />
      )}
    </div>
  );
};

export default Suggestion;
