import glob
import os
import sys

vars = Variables()
vars.AddVariables(
    EnumVariable('mode', 'Build mode', 'debug',
        allowed_values=('debug', 'release', 'profile')),
    BoolVariable('es6', 'Create ES6 js module', False),
    BoolVariable('werror', 'Warnings as error', False),
)

VariantDir('build/src', 'src', duplicate=0)
VariantDir('build/ext_src', 'ext_src', duplicate=0)
env = Environment(variables=vars)

env.Append(CFLAGS= '-Wall -std=gnu11 -Wno-unknown-pragmas -D_GNU_SOURCE '
                   '-Wno-missing-braces',
           CXXFLAGS='-Wall -std=gnu++11 -Wno-narrowing '
                    '-Wno-unknown-pragmas -Wno-unused-function'
                    '-s'
                    'FILESYSTEM=1'
	            '-s'
		    'FORCE_FILESYSTEM=1'
	)

if env['werror']:
    env.Append(CCFLAGS='-Werror')

if env['mode'] == 'debug':
    env.Append(CCFLAGS=['-O0', '-DCOMPILE_TESTS'])

if env['mode'] in ['profile', 'debug']:
    env.Append(CCFLAGS='-g', LINKFLAGS='-g')

if env['mode'] != 'debug':
    env.Append(CCFLAGS='-DNDEBUG')

sources = (glob.glob('src/*.c*') + glob.glob('src/algos/*.c') +
           glob.glob('src/projections/*.c') + glob.glob('src/modules/*.c') +
           glob.glob('src/utils/*.c') + glob.glob('src/private/*.c'))
env.Append(CPPPATH=['src'])

env.Append(CCFLAGS='-include config.h')

env.Append(CCFLAGS='-include ./ext_src/gsl-an/config.h')

sources += glob.glob('ext_src/erfa/*.c')
env.Append(CPPPATH=['ext_src/erfa'])

sources += glob.glob('ext_src/json/*.c')
env.Append(CPPPATH=['ext_src/json'])

env.Append(CPPPATH=['ext_src/uthash'])
env.Append(CPPPATH=['ext_src/stb'])

sources += glob.glob('ext_src/zlib/*.c')
env.Append(CPPPATH=['ext_src/zlib'])
env.Append(CFLAGS=['-DHAVE_UNISTD_H'])

sources += glob.glob('ext_src/inih/*.c')
env.Append(CPPPATH=['ext_src/inih'])

sources += glob.glob('ext_src/nanovg/*.c')
env.Append(CPPPATH=['ext_src/nanovg'])

sources += glob.glob('ext_src/md4c/*.c')
env.Append(CPPPATH=['ext_src/md4c'])
env.Append(CFLAGS=['-DMD4C_USE_UTF8'])

# Add webp
sources += (
    'ext_src/webp/src/dec/alpha_dec.c',
    'ext_src/webp/src/dec/buffer_dec.c',
    'ext_src/webp/src/dec/frame_dec.c',
    'ext_src/webp/src/dec/idec_dec.c',
    'ext_src/webp/src/dec/io_dec.c',
    'ext_src/webp/src/dec/quant_dec.c',
    'ext_src/webp/src/dec/tree_dec.c',
    'ext_src/webp/src/dec/vp8_dec.c',
    'ext_src/webp/src/dec/vp8l_dec.c',
    'ext_src/webp/src/dec/webp_dec.c',
    'ext_src/webp/src/utils/bit_reader_utils.c',
    'ext_src/webp/src/utils/color_cache_utils.c',
    'ext_src/webp/src/utils/filters_utils.c',
    'ext_src/webp/src/utils/huffman_utils.c',
    'ext_src/webp/src/utils/quant_levels_dec_utils.c',
    'ext_src/webp/src/utils/random_utils.c',
    'ext_src/webp/src/utils/rescaler_utils.c',
    'ext_src/webp/src/utils/thread_utils.c',
    'ext_src/webp/src/utils/utils.c',
    'ext_src/webp/src/dsp/cpu.c',
    'ext_src/webp/src/dsp/dec_clip_tables.c')

for fname in ['alpha_processing', 'dec', 'filters', 'lossless', 'rescaler',
        'upsampling', 'yuv']:
    sources += ('ext_src/webp/src/dsp/' + fname + '.c', )

env.Append(CPPPATH=['ext_src/webp'])
env.Append(CPPPATH=['ext_src/webp/src'])


env.Append(CPPPATH=['ext_src'])
env.Append(CPPPATH=['ext_src/astrometry'])
env.Append(CPPPATH=['ext_src/cairo'])

sources += glob.glob('ext_src/qfits-an/*.c')
env.Append(CPPPATH=['ext_src/qfits-an'])


sources += (
    'ext_src/util/ioutils.c',
    'ext_src/util/bl.c',
    'ext_src/util/mathutil.c',
    'ext_src/util/fitsioutils.c',
    'ext_src/util/fitsbin.c',
    'ext_src/util/an-endian.c',
    'ext_src/util/fitsfile.c',
    'ext_src/util/log.c',
    'ext_src/util/errors.c',
    'ext_src/util/tic.c',
    'ext_src/util/datalog.c',

    'ext_src/util/starutil.c',
    'ext_src/util/fileutils.c',
    'ext_src/util/fitstable.c',
    'ext_src/util/image2xy.c',
    'ext_src/util/matchfile.c',
    'ext_src/util/dselip.c',
    'ext_src/util/test_dsmooth.c',
    'ext_src/util/matchobj.c',
    'ext_src/util/an-opts.c',
    'ext_src/util/scamp.c',
    'ext_src/util/permutedsort.c',
    'ext_src/util/scamp-catalog.c',
    'ext_src/util/simplexy.c',
    'ext_src/util/ctmf.c',
    'ext_src/util/dallpeaks.c',
    'ext_src/util/dcen3x3.c',
    'ext_src/util/dfind.c',
    'ext_src/util/dobjects.c',
    'ext_src/util/dmedsmooth.c',
    'ext_src/util/dpeaks.c',
    'ext_src/util/dsigma.c',
    'ext_src/util/resample.c',
    'ext_src/util/sip_qfits.c',
    'ext_src/util/sip.c',
    'ext_src/util/sip-utils.c',
    'ext_src/util/starxy.c',
    'ext_src/util/tabsort.c',
    'ext_src/util/wcs-rd2xy.c',
    'ext_src/util/xylist.c',
    'ext_src/util/anwcs.c',
    'ext_src/util/rdlist.c',
    'ext_src/util/gslutils.c',
    'ext_src/util/index.c',
    'ext_src/util/codekd.c',
    'ext_src/util/healpix.c',
    'ext_src/util/indexset.c',
    'ext_src/util/multiindex.c',
    'ext_src/util/bl-sort.c',
    'ext_src/util/fit-wcs.c',
    'ext_src/util/quadfile.c',
    'ext_src/util/starkd.c',
    
    )
env.Append(CPPPATH=['ext_src/util'])
env.Append(CFLAGS=['-DAN_GIT_URL=\\"https://github.com/dstndstn/astrometry.net\\"'])
env.Append(CFLAGS=['-DAN_GIT_REVISION=\\"\\"'])
env.Append(CFLAGS=['-DAN_GIT_DATE=\\"\\"'])

sources += (
#    'ext_src/libkd/pyspherematch.c',
    'ext_src/libkd/dualtree.c',
    'ext_src/libkd/dualtree_rangesearch.c',
    'ext_src/libkd/dualtree_nearestneighbour.c',
    'ext_src/libkd/kdtree.c',
    'ext_src/libkd/kdtree_dim.c',
    'ext_src/libkd/kdtree_mem.c',
    'ext_src/libkd/kdtree_fits_io.c',
    'ext_src/libkd/kdint_ddd.c',
    'ext_src/libkd/kdint_fff.c',
    'ext_src/libkd/kdint_ddu.c',
    'ext_src/libkd/kdint_duu.c',
    'ext_src/libkd/kdint_dds.c',
    'ext_src/libkd/kdint_dss.c',
    'ext_src/libkd/kdint_lll.c',
    )
env.Append(CPPPATH=['ext_src/libkd'])

sources += glob.glob('ext_src/plot/*.c')
env.Append(CPPPATH=['ext_src/plot'])

sources += (
    'ext_src/bzip2/blocksort.c',
    'ext_src/bzip2/bzlib.c',
    'ext_src/bzip2/compress.c',
    'ext_src/bzip2/crctable.c',
    'ext_src/bzip2/decompress.c',
    'ext_src/bzip2/huffman.c',
    'ext_src/bzip2/randtable.c',
    )
env.Append(CPPPATH=['ext_src/bzip2'])

sources += glob.glob('ext_src/catalogs/*.c')
env.Append(CPPPATH=['ext_src/catalogs'])

sources += (
    'ext_src/cfitsio/fitscore.c',
    'ext_src/cfitsio/group.c',
    'ext_src/cfitsio/checksum.c',
    'ext_src/cfitsio/buffers.c',
    'ext_src/cfitsio/getcol.c',
    'ext_src/cfitsio/putcol.c',
    'ext_src/cfitsio/drvrfile.c',
    'ext_src/cfitsio/drvrmem.c',
    'ext_src/cfitsio/drvrnet.c',

    'ext_src/cfitsio/cfileio.c',
    'ext_src/cfitsio/histo.c',
    'ext_src/cfitsio/edithdu.c',
    'ext_src/cfitsio/eval_f.c',
    'ext_src/cfitsio/putkey.c',
    'ext_src/cfitsio/editcol.c',
    'ext_src/cfitsio/getcolb.c',
    'ext_src/cfitsio/modkey.c',
    'ext_src/cfitsio/getcoli.c',
    'ext_src/cfitsio/getcolj.c',
    'ext_src/cfitsio/getcolk.c',
    'ext_src/cfitsio/getcole.c',
    'ext_src/cfitsio/getcold.c',
    'ext_src/cfitsio/getcoll.c',
    'ext_src/cfitsio/getcols.c',
    'ext_src/cfitsio/getcoluj.c',
    'ext_src/cfitsio/getcolsb.c',
    'ext_src/cfitsio/getcolui.c',
    'ext_src/cfitsio/getcoluk.c',
    'ext_src/cfitsio/getkey.c',
    'ext_src/cfitsio/putcolb.c',
    'ext_src/cfitsio/putcold.c',
    'ext_src/cfitsio/putcole.c',
    'ext_src/cfitsio/putcoli.c',
    'ext_src/cfitsio/putcolj.c',
    'ext_src/cfitsio/putcolk.c',
    'ext_src/cfitsio/putcoll.c',
    'ext_src/cfitsio/putcols.c',
    'ext_src/cfitsio/putcolsb.c',
    'ext_src/cfitsio/putcolu.c',
    'ext_src/cfitsio/putcolui.c',
    'ext_src/cfitsio/putcoluj.c',
    'ext_src/cfitsio/putcoluk.c',
    'ext_src/cfitsio/scalnull.c',
    'ext_src/cfitsio/grparser.c',
    'ext_src/cfitsio/region.c',
    'ext_src/cfitsio/eval_l.c',
    'ext_src/cfitsio/eval_y.c',
    'ext_src/cfitsio/imcompress.c',
    'ext_src/cfitsio/zcompress.c',
    'ext_src/cfitsio/wcssub.c',
    'ext_src/cfitsio/wcsutil.c',
    'ext_src/cfitsio/fits_hcompress.c',
    'ext_src/cfitsio/fits_hdecompress.c',
    'ext_src/cfitsio/quantize.c',
    'ext_src/cfitsio/ricecomp.c',
    'ext_src/cfitsio/pliocomp.c',
    'ext_src/cfitsio/simplerng.c',
    'ext_src/cfitsio/swapproc.c',
    'ext_src/cfitsio/iraffits.c',
    'ext_src/cfitsio/zuncompress.c',


    )
env.Append(CPPPATH=['ext_src/cfitsio'])

sources += (
    'ext_src/gsl-an/matrix/init.c',
    'ext_src/gsl-an/matrix/submatrix.c',
    'ext_src/gsl-an/block/init.c',
    'ext_src/gsl-an/vector/init.c',
    'ext_src/gsl-an/vector/copy.c',
    'ext_src/gsl-an/vector/subvector.c',

    'ext_src/gsl-an/err/error.c',
    'ext_src/gsl-an/err/strerror.c',
    'ext_src/gsl-an/err/stream.c',
    'ext_src/gsl-an/linalg/qr.c',

    # 'ext_src/gsl-an/matrix/init_source.c',
    # 'ext_src/gsl-an/block/init_source.c',
    # 'ext_src/gsl-an/vector/init_source.c',

    'ext_src/gsl-an/blas/blas.c',
    'ext_src/gsl-an/cblas/dtrsv.c',
    'ext_src/gsl-an/cblas/daxpy.c',
    'ext_src/gsl-an/cblas/ddot.c',
    'ext_src/gsl-an/cblas/dnrm2.c',
    'ext_src/gsl-an/cblas/xerbla.c',
    'ext_src/gsl-an/cblas/dscal.c',
    'ext_src/gsl-an/cblas/dgemm.c',

    'ext_src/gsl-an/linalg/householder.c',
    'ext_src/gsl-an/matrix/rowcol.c',
    #'ext_src/gsl-an/linalg/svd.c',
    'ext_src/gsl-an/linalg/bidiag.c',
    'ext_src/gsl-an/sys/infnan.c',
    
    
    # 'ext_src/gsl-an/vector/copy_source.c',
    # 'ext_src/gsl-an/vector/subvector_source.c',
    
)

env.Append(CPPPATH=['ext_src/gsl-an'])


sources += (
    'ext_src/solver/catalog.c',
    'ext_src/solver/codefile.c',
    'ext_src/solver/verify.c',
    'ext_src/solver/solver.c',
    'ext_src/solver/solvedfile.c',

    'ext_src/solver/solve-field.c',
    'ext_src/solver/augment-xylist.c',
    'ext_src/solver/cut-table.c',
    'ext_src/solver/fits-guess-scale.c',
    'ext_src/solver/image2xy-files.c',
    'ext_src/solver/new-wcs.c',
    'ext_src/solver/resort-xylist.c',

    'ext_src/solver/pnpoly.c',
    'ext_src/solver/tweak.c',
    'ext_src/solver/solverutils.c',
    'ext_src/solver/engine.c',
    'ext_src/solver/engine-main.c',
    'ext_src/solver/onefield.c',
    'ext_src/solver/quad-utils.c',

    'ext_src/solver/tweak2.c',

    
    )
env.Append(CPPPATH=['ext_src/solver'])

sources = ['build/%s' % x for x in sources]

if not env.GetOption('clean'):
    assert(os.environ['EMSCRIPTEN_TOOL_PATH'])
    # EMSCRIPTEN_ROOT need to be set, but current emscripten version doesn't
    # provide it. Here we set it automatically from EMSCRIPTEN_TOOL_PATH:
    os.environ['EMSCRIPTEN_ROOT'] = os.path.join(
        os.environ['EMSCRIPTEN_TOOL_PATH'], '../../../../../')
    env.Tool('emscripten', toolpath=[os.environ['EMSCRIPTEN_TOOL_PATH']])

# Clang does not like overrided initializers.
env.Append(CCFLAGS=['-Wno-initializer-overrides'])
env.Append(CCFLAGS='-DNO_LIBCURL')

# All the emscripten runtime functions we use.
# Needed since emscripten 1.37.
extra_exported = [
    'ALLOC_NORMAL',
    'GL',
    'UTF8ToString',
    '_free',
    '_malloc',
    'addFunction',
    'allocate',
    'ccall',
    'cwrap',
    'getValue',
    'intArrayFromString',
    'lengthBytesUTF8',
    'removeFunction',
    'setValue',
    'stringToUTF8',
    'writeAsciiToMemory',
    'writeArrayToMemory',
    'PIPEFS',
]
extra_exported = ','.join("'%s'" % x for x in extra_exported)

flags = [
         '-s', 'MODULARIZE=1', '-s', 'EXPORT_NAME=StelWebEngine',
         '-s', 'ALLOW_MEMORY_GROWTH=1',
         '-s', 'ALLOW_TABLE_GROWTH=1',
         '--pre-js', 'src/js/pre.js',
         '--pre-js', 'src/js/obj.js',
         '--pre-js', 'src/js/geojson.js',
         '--pre-js', 'src/js/canvas.js',
         #'--pre-js', 'src/js/server.js',
         # '-s', 'STRICT=1', # Note: to put back once we switch to emsdk 2
         '-s', 'RESERVED_FUNCTION_POINTERS=10',
         '-O3',
         '-s', 'USE_WEBGL2=1',
         '-s', 'NO_EXIT_RUNTIME=1',
         '-s', '"EXPORTED_FUNCTIONS=[]"',
         '-s', '"EXTRA_EXPORTED_RUNTIME_METHODS=[%s]"' % extra_exported,
         '-s', 'FILESYSTEM=0'
        ]

#if env['mode'] not in ['profile', 'debug']:
#    flags += ['--closure', '1']

if env['mode'] in ['profile', 'debug']:
    flags += [
        '--profiling',
        '-s', 'ASM_JS=2', # Removes 'use asm'.
    ]

if env['mode'] == 'debug':
    flags += ['-s', 'SAFE_HEAP=1', '-s', 'ASSERTIONS=1',
              '-s', 'WARN_UNALIGNED=1']

if env['es6']:
    flags += ['-s', 'EXPORT_ES6=1', '-s', 'USE_ES6_IMPORT_META=0']
    
flags += ['-s', 'FILESYSTEM=1', '-s', 'FORCE_FILESYSTEM=1']

env.Append(CCFLAGS=['-DNO_ARGP', '-DGLES2 1'] + flags)
env.Append(LINKFLAGS=flags)
env.Append(LIBS=['GL'])


# # 添加 GSL 库路径
# env.Append(LIBPATH=['/usr/local/astrometry/lib'])  # 替换为实际的库路径

# # 添加 GSL 库名
# env.Append(LIBS=['gsl-an', 'gslcblas'])  # 如果需要链接 gslcblas 库

# env.Append(LINKFLAGS=['-L/usr/local/astrometry/lib', '-lgsl-an'])



prog = env.Program(target='build/stellarium-web-engine.js', source=sources)
env.Depends(prog, glob.glob('src/*.js'))
env.Depends(prog, glob.glob('src/js/*.js'))

# Copy js files in the html example after build.
env.Depends('build/stellarium-web-engine.wasm', prog)

env.Program(target='build/stellarium-web-engine', source=sources)

# Ugly hack to run makeasset before each compilation
from subprocess import call
call('./tools/make-assets.py')
