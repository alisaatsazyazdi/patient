import { useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import useResponsive from '@/common/hooks/useResponsive';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { SearchBar } from '../../components/suggestion/searchBar';
import SuggestionCentent from '../../components/suggestion/suggestionCentent';
import { useSearchStore } from '../../store/search';

export const Suggestion = () => {
  const [isOpenSuggestion, setIsShouldOpen] = useState(false);
  const { isMobile } = useResponsive();
  const userSearchValue = useSearchStore(state => state.userSearchValue);
  const city = useSearchStore(state => state.city);
  const searchSuggestion = useSearchSuggestion(
    {
      query: userSearchValue,
      ...(city.id !== '-1' && { city_id: city.id }),
    },
    {
      enabled: false,
    },
  );
  const [items, setItems] = useState([]);
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, () => !isMobile && setIsShouldOpen(false));

  const clickSerchInput = () => {
    setIsShouldOpen(true);
  };

  const clickBackButton = () => {
    setIsShouldOpen(false);
  };

  useEffect(() => {
    searchSuggestion.remove();
    searchSuggestion.refetch();
  }, [userSearchValue, city]);

  useEffect(() => {
    if (searchSuggestion.isSuccess) setItems(searchSuggestion.data?.data ?? []);
  }, [searchSuggestion.status]);

  useEffect(() => {
    if (isOpenSuggestion && isMobile) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpenSuggestion, isMobile]);

  return (
    <div className="w-full lg:w-[50rem] relative" ref={ref}>
      <SearchBar
        isOpenSuggestion={isOpenSuggestion}
        onClickSearchInput={clickSerchInput}
        onClickBackButton={clickBackButton}
        className={{
          'rounded-br-none rounded-bl-none rounded-tr-3xl rounded-tl-3xl border-transparent': isOpenSuggestion,
          'hover:md:shadow-lg': !isOpenSuggestion,
        }}
      />
      {isOpenSuggestion && (
        <SuggestionCentent
          searchInput={
            isMobile ? (
              <SearchBar isOpenSuggestion={isOpenSuggestion} onClickBackButton={clickBackButton} className="!border-primary" />
            ) : undefined
          }
          items={items}
          className="shadow-md"
        />
      )}
    </div>
  );
};

export default Suggestion;