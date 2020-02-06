import path from 'path';
import { compose, prop, concat, reverse, curry } from 'ramda';

export const getFilenameWithoutExt = compose(prop('name'), path.parse, path.resolve)
export const getFolder = compose(prop('dir'), path.parse, path.resolve)

export const changeExtOf = filePath => ext => path.resolve(getFolder(filePath), compose(concat, getFilenameWithoutExt)(filePath)(ext))

export const changeExtTo = ext => filePath => path.resolve(getFolder(filePath), compose(concat, getFilenameWithoutExt)(filePath)(ext))

export const changeExtToPDF = changeExtTo('.pdf')
