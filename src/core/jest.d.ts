declare global {
  namespace jest {
    interface Matchers<R> {
      // containsErrorMessages(expected: FieldsErrors): R
      notificationContainsErrorMessages: (
        expected: Array<string | Record<string, string[]>>,
      ) => R
    }
  }
}

export { };

