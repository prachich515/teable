import { useQuery } from '@tanstack/react-query';
import { User as UserIcon } from '@teable-group/icons';
import { getBaseCollaboratorList } from '@teable-group/openapi';
import { Avatar, AvatarFallback, AvatarImage } from '@teable-group/ui-lib';
import React, { useCallback, useMemo } from 'react';
import { ReactQueryKeys } from '../../../config';
import { useTranslation } from '../../../context/app/i18n';
import { useBase, useSession } from '../../../hooks';
import type { UserField } from '../../../model';
import { BaseMultipleSelect, BaseSingleSelect } from './base';

interface IFilterUserProps {
  field: UserField;
  operator: string;
  value: string[] | null;
  onSelect: (value: string[] | string | null) => void;
}

const SINGLESELECTOPERATORS = ['is', 'isNot'];

const FilterUserSelectBase = (props: IFilterUserProps) => {
  const { user: currentUser } = useSession();
  const { id: baseId } = useBase();
  const { t } = useTranslation();
  const { value, onSelect, operator } = props;
  const values = useMemo<string | string[] | null>(() => value, [value]);

  const { data: collaborators } = useQuery({
    queryKey: ReactQueryKeys.baseCollaboratorList(baseId),
    queryFn: ({ queryKey }) => getBaseCollaboratorList(queryKey[1]).then(({ data }) => data),
  });

  const options = useMemo(() => {
    if (!collaborators?.length) return [];

    const map = collaborators.map(({ userId, userName, avatar }) => ({
      value: userId,
      label: userName,
      avatar: avatar,
    }));

    if (currentUser) {
      map.unshift({
        value: 'Me',
        label: t('filter.currentUser'),
        avatar: null,
      });
    }
    return map;
  }, [collaborators, currentUser, t]);

  const displayRender = useCallback((option: (typeof options)[number]) => {
    return (
      <div
        className="mx-1 rounded-lg bg-secondary px-2 text-secondary-foreground"
        key={option.value}
      >
        <div className="flex items-center space-x-2">
          <Avatar className="h-7 w-7 border">
            {option.value === 'Me' ? (
              <span className="flex h-full w-full items-center justify-center">
                <UserIcon className="h-4 w-4" />
              </span>
            ) : (
              <>
                <AvatarImage src={option.avatar as string} alt="avatar-name" />
                <AvatarFallback className="text-sm">{option.label.slice(0, 1)}</AvatarFallback>
              </>
            )}
          </Avatar>
          <p>{option.label}</p>
        </div>
      </div>
    );
  }, []);

  const optionRender = useCallback((option: (typeof options)[number]) => {
    return (
      <div
        key={option.value}
        className="truncate rounded-lg bg-secondary px-2 text-secondary-foreground"
      >
        <div className="flex items-center space-x-2">
          <Avatar className="h-7 w-7 border">
            {option.value === 'Me' ? (
              <span className="flex h-full w-full items-center justify-center">
                <UserIcon className="h-4 w-4" />
              </span>
            ) : (
              <>
                <AvatarImage src={option.avatar as string} alt="avatar-name" />
                <AvatarFallback className="text-sm">{option.label.slice(0, 1)}</AvatarFallback>
              </>
            )}
          </Avatar>
          <p>{option.label}</p>
        </div>
      </div>
    );
  }, []);

  return (
    <>
      {SINGLESELECTOPERATORS.includes(operator) ? (
        <BaseSingleSelect
          options={options}
          onSelect={onSelect}
          value={values as string}
          displayRender={displayRender}
          optionRender={optionRender}
          className="w-64"
          popoverClassName="w-64"
        />
      ) : (
        <BaseMultipleSelect
          options={options}
          onSelect={onSelect}
          value={values as string[]}
          displayRender={displayRender}
          optionRender={optionRender}
          className="w-64"
          popoverClassName="w-64"
        />
      )}
    </>
  );
};

const FilterUserSelect = (props: IFilterUserProps) => {
  return <FilterUserSelectBase {...props} />;
};

export { FilterUserSelect };
