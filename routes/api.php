<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CorreiosController;
use App\Http\Controllers\Admin\OptionsController as AdminOptionsController;
use App\Http\Controllers\Admin\Api\PageApiController as AdminPageApiController;
use App\Http\Controllers\Admin\Api\UserApiController as AdminUserApiController;
use App\Http\Controllers\Admin\Api\BrandApiController as AdminBrandApiController;
use App\Http\Controllers\Admin\Api\GalleryApiController as AdminGalleryApiController;
use App\Http\Controllers\Admin\Api\CategoryApiController as AdminCategoryApiController;
use App\Http\Controllers\Admin\Api\ProductApiController as AdminProductApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('painel')->group(function() {
    Route::get('products/get', [AdminProductApiController::class, 'get_products'])->name('getProducts');
    Route::put('products/update/{id}', [AdminProductApiController::class, 'update'])->name('products.update');
    Route::post('products/create/user', [AdminProductApiController::class, 'store'])->name('products.add');
    Route::delete('products/destroy/{id}', [AdminProductApiController::class, 'destroy'])->name('products.destroy');

    Route::get('options/get', [AdminOptionsController::class, 'get_options'])->name('getOptions');
    Route::put('options/update/{id}', [AdminOptionsController::class, 'update'])->name('options.update');
    Route::post('options/create/user', [AdminOptionsController::class, 'store'])->name('options.add');
    Route::delete('options/destroy', [AdminOptionsController ::class, 'destroy'])->name('options.destroy');

    Route::get('users/get', [AdminUserApiController::class, 'get_users'])->name('getUsers');
    Route::put('users/update/{id}', [AdminUserApiController::class, 'update'])->name('users.update');
    Route::post('users/create/user', [AdminUserApiController::class, 'store'])->name('users.add');
    Route::delete('users/destroy/{id}', [AdminUserApiController::class, 'destroy'])->name('users.destroy');

    Route::get('pages/get', [AdminPageApiController::class, 'get_pages'])->name('getPages');
    Route::put('pages/update/{id}', [AdminPageApiController::class, 'update'])->name('pages.update');
    Route::post('pages/create/user', [AdminPageApiController::class, 'create_page'])->name('pages.add');
    Route::post('pages/imageupload', [AdminPageApiController::class, 'imageupload'])->name('imageupload');
    Route::delete('pages/destroy/{id}', [AdminPageApiController::class, 'destroy'])->name('pages.destroy');

    Route::get('brands/get', [AdminBrandApiController::class, 'get_brands'])->name('getBrands');
    Route::post('brands/update/{id}', [AdminBrandApiController::class, 'update'])->name('brands.update');
    Route::post('brands/create/user', [AdminBrandApiController::class, 'store'])->name('brands.add');
    Route::delete('brands/destroy/{id}', [AdminBrandApiController::class, 'destroy'])->name('brands.destroy');

    Route::get('categories/get', [AdminCategoryApiController::class, 'get_categories'])->name('getCategories');
    Route::post('categories/update/{id}', [AdminCategoryApiController::class, 'update'])->name('categories.update');
    Route::post('categories/create/user', [AdminCategoryApiController::class, 'store'])->name('categories.add');
    Route::delete('categories/destroy/{id}', [AdminCategoryApiController::class, 'destroy'])->name('categories.destroy');

    Route::get('gallery/get', [AdminGalleryApiController::class, 'get_photos'])->name('getPhotos');
    Route::post('gallery/update/{id}', [AdminGalleryApiController::class, 'update'])->name('gallery.update');
    Route::post('gallery/add/photo', [AdminGalleryApiController::class, 'store'])->name('gallery.add');
    Route::delete('gallery/destroy/{id}', [AdminGalleryApiController::class, 'destroy'])->name('gallery.destroy');
});

Route::get('cep', [CorreiosController::class, 'cep'])->name('cep');
