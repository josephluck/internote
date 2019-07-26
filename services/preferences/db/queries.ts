import { Preferences, defaultPreferences } from "./models";
import { PreferencesRepository } from "./repositories";
import { notFoundError, isDbError } from "@internote/lib/errors";

export const find = async (id: string) => {
  try {
    const { data: preferences } = await PreferencesRepository.find({
      id
    }).execute();
    return preferences;
  } catch (err) {
    if (isDbError(err, "ItemNotFound")) {
      throw notFoundError(`Preferences for user ${id} could not be found`);
    } else {
      throw err;
    }
  }
};

export const update = async (id: string, updates: Partial<Preferences>) => {
  const { data: preferences } = await PreferencesRepository.update({
    ...updates,
    id
  }).execute();
  return preferences;
};

export const create = async (id: string) => {
  console.log("Creating preferences");
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
