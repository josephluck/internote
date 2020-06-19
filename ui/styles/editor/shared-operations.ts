import { Operation } from "slate";
import { InternoteSlateEditor } from "./types";
import { useRef, useCallback, useEffect } from "react";

/**
 * Adds real-time collaboration via shared operations.
 */
export const useSharedOperations = (editor: InternoteSlateEditor) => {
  /**
   * Keeps a reference of all the shared operations made to a document, both for
   * the current user and any other user.
   */
  const sharedOperations = useRef<SharedOperation[]>([]);
  /**
   * Keeps a log of which shared operations have been applied to the current
   * user's document. Prevents an operation from being applied more than once.
   */
  const appliedSharedOperations = useRef<string[]>([]);
  /**
   * Determines whether a shared operation has already been flushed to the current
   * user's document.
   */
  const hasAlreadyApplied = useCallback(
    (id: string) => appliedSharedOperations.current.includes(id),
    []
  );

  /**
   * Capture's current user's changes and adds them to the buffer.
   */
  const broadcastNewOperation = useCallback((operation: Operation) => {
    const id = Date.now().toString();
    appliedSharedOperations.current.push(id);
    sharedOperations.current.push({ ...operation, id });
  }, []);

  const captureSharedOperations = useCallback(() => {
    editor.operations
      .filter((op) => !isSharedOperation(op) || !hasAlreadyApplied(op.id))
      .forEach((op) => {
        if (isSharedOperation(op)) {
          // TODO this doesn't do anything?
          sharedOperations.current.filter((v) => v.id !== op.id);
        } else {
          // This is a new operation the current user has made
          broadcastNewOperation(op);
        }
      });
  }, []);

  /**
   * Flushes the shared operations buffer to the editor and applies them
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const pending = sharedOperations.current.filter(
        ({ id }) => !hasAlreadyApplied(id)
      );
      pending.forEach(editor.apply);
      pending.forEach(({ id }) => appliedSharedOperations.current.push(id));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Demo's receiving some external shared operations from another user
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const op: SharedOperation = {
  //       id: Date.now().toString(),
  //       type: "insert_text",
  //       path: [1, 1],
  //       offset: 15,
  //       text: "x",
  //     };
  //     sharedOperations.current.push(op);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  return { captureSharedOperations };
};

type SharedOperation = Operation & { id: string };

const isSharedOperation = (value: any): value is SharedOperation =>
  Operation.isOperation(value) && value.hasOwnProperty("id");
