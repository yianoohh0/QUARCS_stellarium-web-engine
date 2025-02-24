/*
 # This file is part of the Astrometry.net suite.
 # Licensed under a 3-clause BSD style license - see LICENSE
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#include "cutest.h"
#include "os-features.h"
#include "simplexy-common.h"

int dsmooth(float* image, int nx, int ny, float sigma, float* smooth);
void dsmooth2(float* image, int nx, int ny, float sigma, float* smooth);

void dsmooth2(float* image, int nx, int ny, float sigma, float* smooth){
    int i, j, npix, half, start, end, sample;
	float neghalfinvvar, total, scale, dx, sum;
	float* kernel1D;
    float* kernel_shifted;
	float* smooth_temp;

	// make the kernel
	npix = 2 * ((int) ceilf(3. * sigma)) + 1;
	half = npix / 2;
	kernel1D =  malloc(npix * sizeof(float));
	neghalfinvvar = -1.0 / (2.0 * sigma * sigma);
	for (i=0; i<npix; i++) {
        dx = ((float) i - 0.5 * ((float)npix - 1.));
        kernel1D[i] = exp((dx * dx) * neghalfinvvar);
	}

	// normalize the kernel
	total = 0.0;
	for (i=0; i<npix; i++)
        total += kernel1D[i];
	scale = 1. / total;
	for (i=0; i<npix; i++)
        kernel1D[i] *= scale;

	smooth_temp = malloc(sizeof(float) * MAX(nx, ny));

    // Here's some trickery: we set "kernel_shifted" to be an array where:
    //   kernel_shifted[0] is the middle of the array,
    //   kernel_shifted[-half] is the left edge (ie the first sample),
    //   kernel_shifted[half] is the right edge (last sample)
	kernel_shifted = kernel1D + half;

	// convolve in x direction, dumping results into smooth_temp
	for (j=0; j<ny; j++) {
        float* imagerow = image + j*nx;
        for (i=0; i<nx; i++) {
            /*
             The outer loops are over OUTPUT pixels;
             the "sample" loop is over INPUT pixels.

             We're summing over the input pixels that contribute to the value
             of the output pixel.
             */
            start = MAX(0, i - half);
            end = MIN(nx-1, i + half);
            sum = 0.0;
            for (sample=start; sample <= end; sample++)
                sum += imagerow[sample] * kernel_shifted[sample - i];
            smooth_temp[i] = sum;
        }
        memcpy(smooth + j*nx, smooth_temp, nx * sizeof(float));
    }

	// convolve in the y direction, dumping results into smooth
	for (i=0; i<nx; i++) {
        float* imagecol = smooth + i;
        for (j=0; j<ny; j++) {
            start = MAX(0, j - half);
            end = MIN(ny-1, j + half);
            sum = 0.0;
            for (sample=start; sample<=end; sample++)
                sum += imagecol[sample*nx] * kernel_shifted[sample - j];
            smooth_temp[j] = sum;
        }
        for (j=0; j<ny; j++)
            smooth[i + j*nx] = smooth_temp[j];
	}
	FREEVEC(smooth_temp);
	FREEVEC(kernel1D);

}
    

int compare_images(float *i1, float* i2, int nx, int ny, float eps) {
    int i, j;
    int fail = 0;
    for (j=0; j<ny; j++) {
        for (i=0; i<nx; i++) {
            int ind = nx*j+i;
            float v1 = i1[ind];
            float v2 = i2[ind];
            if (fabsf(v1 - v2) > eps) {
                printf("failure -- %f != %f (delta %f)\n", v1, v2, fabsf(v1-v2));
                fail++;
            }
        }
    }
    return fail;
}

float* random_image(int nx, int ny) {
    int i;
    float* img;
    img = malloc(nx * ny * sizeof(float));
    for (i=0; i<(nx*ny); i++)
        img[i] = rand() / (float)RAND_MAX;
    return img;
}

void test_dsmooth_vs_dsmooth2(CuTest* tc) {
    float* img;
    float* img_orig;
    int nx, ny;
    float* smooth1;
    float* smooth2;
    float sigma;
    int bites;
    float eps;

    nx = 20;
    ny = 19;
    sigma = 2.0;
    eps = 1e-6;

    bites = nx * ny * sizeof(float);

    img = random_image(nx, ny);
    img_orig = calloc(bites, 1);
    memcpy(img_orig, img, bites);

    CuAssertIntEquals(tc, 0, compare_images(img, img_orig, nx, ny, 0.0));

    smooth1 = calloc(bites, 1);
    smooth2 = calloc(bites, 1);

    dsmooth(img, nx, ny, sigma, smooth1);
    // test: don't change the input image
    CuAssertIntEquals(tc, 0, compare_images(img, img_orig, nx, ny, 0.0));
    dsmooth2(img, nx, ny, sigma, smooth2);
    // test: don't change the input image
    CuAssertIntEquals(tc, 0, compare_images(img, img_orig, nx, ny, 0.0));

    // test: dsmooth == dsmooth2
    CuAssertIntEquals(tc, 0, compare_images(smooth1, smooth2, nx, ny, eps));

    free(img);
    free(img_orig);
    free(smooth1);
    free(smooth2);
}

void test_dsmooth2_inplace(CuTest* tc) {
    float* img;
    int nx, ny;
    float* smooth1;
    float* smooth2;
    float sigma;
    int bites;
    float eps;

    nx = 20;
    ny = 19;
    sigma = 2.0;
    eps = 1e-6;

    bites = nx * ny * sizeof(float);

    img = random_image(nx, ny);
    smooth1 = calloc(bites, 1);
    smooth2 = calloc(bites, 1);

    dsmooth2(img, nx, ny, sigma, smooth2);

    // test: can we smooth in-place with dsmooth2?
    memcpy(smooth1, img, bites);
    CuAssertIntEquals(tc, 0, compare_images(img, smooth1, nx, ny, 0.0));

    dsmooth2(smooth1, nx, ny, sigma, smooth1);
    CuAssertIntEquals(tc, 0, compare_images(smooth1, smooth2, nx, ny, eps));

    free(img);
    free(smooth1);
    free(smooth2);
}
