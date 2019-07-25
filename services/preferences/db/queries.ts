import { Preferences, defaultPreferences } from "./models";
import { PreferencesRepository } from "./repositories";

export const find = async (id: string) => {
  const { data: preferences } = await PreferencesRepository.find({
    id
  }).execute();
  return preferences;
};

export const update = async (id: string, updates: Partial<Preferences>) => {
  const { data: preferences } = await PreferencesRepository.update({
    ...updates,
    id
  }).execute();
  return preferences;
};

export const create = async (id: string) => {
  const { data: preferences } = await PreferencesRepository.save({
    ...defaultPreferences,
    id
  }).execute();
  return preferences;
};

export const destroy = async (id: string) => {
  const { data: preferences } = await PreferencesRepository.delete({
    id
  }).execute();
  return preferences;
};
