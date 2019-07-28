import HttpError from "http-errors";
import { Preferences, defaultPreferences } from "./models";
import { PreferencesRepository } from "./repositories";
import { isDbError } from "@internote/lib/errors";
import { attributeNotExists } from "type-dynamo";

export const findPreferencesById = async (id: string) => {
  try {
    const result = await PreferencesRepository.find({
      id
    }).execute();
    return result.data;
  } catch (err) {
    if (isDbError(err, "ItemNotFound")) {
      throw new HttpError.NotFound(
        `Preferences for user ${id} could not be found`
      );
    } else {
      throw err;
    }
  }
};

export const updatePreferencesById = async (
  id: string,
  updates: Partial<Preferences>
) => {
  try {
    const result = await PreferencesRepository.update(
      { id },
      updates
    ).execute();
    return result.data;
  } catch (err) {
    if (isDbError(err, "ItemNotFound")) {
      throw new HttpError.NotFound(
        `Preferences for user ${id} could not be found`
      );
    } else {
      throw err;
    }
  }
};

export const createPreferences = async (id: string) => {
  const result = await PreferencesRepository.save({
    ...defaultPreferences,
    id
  })
    .withCondition(attributeNotExists("id"))
    .execute();
  return result.data;
};

export const deletePreferencesById = async (id: string) => {
  try {
    const result = await PreferencesRepository.delete({
      id
    }).execute();
    return result.data;
  } catch (err) {
    if (isDbError(err, "ItemNotFound")) {
      throw new HttpError.NotFound(
        `Preferences for user ${id} could not be found`
      );
    } else {
      throw err;
    }
  }
};
