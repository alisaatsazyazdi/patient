import clsx from 'clsx';
import { HTMLAttributes, ReactElement } from 'react';
import CategoryBar from './suggestionAtoms/categoryBar';
import CardSection from './suggestionSection/card';
import SearchSection from './suggestionSection/search';
import SliderSection from './suggestionSection/slider';
import TextSection from './suggestionSection/text';
import TreeSection from './suggestionSection/tree';

interface SuggestionCententProps extends HTMLAttributes<HTMLDivElement> {
  items: Idata[];
  searchInput?: ReactElement;
}

export interface Idata {
  caption?: string;
  additional_info?: string;
  type: string;
  icon: 'hospital-icon' | 'top-icon' | 'list-icon' | 'category-icon' | 'history-icon' | 'search-icon';
  component: string;
  items: Item[];
}

export type Item = {
  id?: number;
  title?: string;
  name?: string;
  url?: string | null;
  formatted_title?: string | null;
  type?: string;
  use_suggestion?: boolean;
  position?: number;
  section_position?: number;
  image?: string | null;
  sub_title?: string;
  cities?: string[];
  is_online?: boolean;
  activity?: string[];
  count?: number;
  no_icon?: boolean;
  sub_items?: Item[];
};

export const SuggestionCentent = (props: SuggestionCententProps) => {
  const { className, items, searchInput } = props;
  return (
    <div
      className={clsx(
        'fixed right-0 overflow-hidden top-0 h-full z-infinity md:absolute md:h-96 md:top-16 w-full flex flex-col bg-white rounded-bl-xl rounded-br-xl',
        className,
      )}
    >
      {searchInput && <div className="p-2 bg-white shadow-sm z-20 stiky top-0">{searchInput}</div>}
      <div className="flex flex-col overflow-auto">
        {items?.map(({ items, component, ...section }, index) => (
          <div key={index}>
            {component !== 'search' && (
              <>
                <CategoryBar {...section} />
                {component === 'text' && <TextSection items={items} />}
                {component === 'slider' && <SliderSection items={items} />}
                {component === 'tree' && <TreeSection items={items} />}
                {component === 'card' && <CardSection items={items} />}
              </>
            )}
            {component === 'search' && (
              <SearchSection formatted_title={items[0]?.formatted_title ?? ''} icon={section.icon} url={items[0]?.url ?? ''} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionCentent;