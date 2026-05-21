import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/services/api';
import type { components } from '@/types/api';

export type CharacterResult = components['schemas']['CharacterResult'];

export const characterQueries = {
  list: () =>
    queryOptions({
      queryKey: ['characters'],
      queryFn: async () => {
        const res =
          await api.get<components['schemas']['ApiResponseListCharacterResult']>(
            '/api/v1/characters',
          );
        return res.data ?? [];
      },
    }),
};

export function useCharacters() {
  return useQuery(characterQueries.list());
}
