import * as Types from "@internote/api/types";
import * as faker from "faker";

export function note(): Types.Note {
  return {
    title: faker.lorem.sentence(),
    createdOn: faker.date.past().toLocaleDateString(),
    updatedOn: faker.date.past().toLocaleDateString(),
    content: faker.lorem.paragraphs(faker.random.number({ min: 5, max: 10 }))
  };
}
