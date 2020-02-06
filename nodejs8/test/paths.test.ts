import path from 'path';
import assert = require('assert');
import { getFilenameWithoutExt, changeExtOf, changeExtTo, changeExtToPDF } from '../paths'

describe('paths', () => {
    it('get file name with extension', () => {
        const packagePath = 'package.json';

        assert(getFilenameWithoutExt(packagePath) === 'package')
    })

    it('replace ext', () => {
        const packagePath = '/tmp/package.json';

        assert(changeExtOf(packagePath)('.pdf') === path.resolve('/tmp/package.pdf'))
        assert(changeExtTo('.pdf')(packagePath) === path.resolve('/tmp/package.pdf'))
        assert(changeExtToPDF(packagePath) === path.resolve('/tmp/package.pdf'))
    })
})