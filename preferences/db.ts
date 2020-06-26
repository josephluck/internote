import { isDbError } from "@internote/lib/errors";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import HttpError from "http-errors";

import { env } from "./env";
import { Preferences, defaultPreferences } from "./models";

const client = new DocumentClient();

export const findPreferencesById = async (id: string): Promise<Preferences> => {
  try {
    const result = await client
      .get({
        TableName: env.PREFERENCES_TABLE_NAME,
        Key: { [env.PREFERENCES_TABLE_PARTITION_KEY]: id },
      })
      .promise();

    if (!result.Item) {
      throw new HttpError.NotFound(
        `Preferences for user ${id} could not be found`
      );
    }

    return result.Item as Preferences;
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
): Promise<Preferences> => {
  try {
    const existingPreferences = await findPreferencesById(id);
    const item: Preferences = {
      ...defaultPreferences,
      ...existingPreferences,
      ...updates,
      [env.PREFERENCES_TABLE_PARTITION_KEY]: id,
    };
    await client
      .put({
        TableName: env.PREFERENCES_TABLE_NAME,
        Item: {
          [env.PREFERENCES_TABLE_PARTITION_KEY]: id,
          ...item,
        },
      })
      .promise();
    return item;
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

export const createPreferences = async (id: string): Promise<Preferences> => {
  const item: Preferences = {
    ...defaultPreferences,
    [env.PREFERENCES_TABLE_PARTITION_KEY]: id,
  };

  await client
    .put({
      TableName: env.PREFERENCES_TABLE_NAME,
      Item: item,
      // TODO: ConditionExpression based on primary key
    })
    .promise();

  return item;
};

export const deletePreferencesById = async (id: string) => {
  try {
    await client
      .delete({
        TableName: env.PREFERENCES_TABLE_NAME,
        Key: {
          [env.PREFERENCES_TABLE_PARTITION_KEY]: id,
        },
      })
      .promise();
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
