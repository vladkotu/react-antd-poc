
export const idValidationSchema = {
  id: {
      in: ['params'],
    errorMessage: 'Id is must have',
  },
}

export const createdDateValidationSchema = {
  createdDateTime: {
    in: ['query', 'body'],
    toInt: true,
    errorMessage: 'createdDate is must have',
  },
}
