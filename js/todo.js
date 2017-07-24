/**
 * Created by Alisa on 22.07.17.
 */

var $input = $('.input');
var $list = $('.list');
var $btn = $('.btn');
var $btnCompleted = $('.filter__btn_completed');
var $btnActive = $('.filter__btn_active');
var $btnAll = $('.filter__btn_all');
var $btnClear = $('.filter__btn_clear');
var $filterButton = $('.filter__btn');
var $wrapper = $('.wrapper');
var shakeTimeout;

function updateCounter() {
    var count = $('label:not(.crossed)').length;

    $('.counter__value').text(count);
}

/**
 * Функция добавления кнопки - 'clear completed'
 */
function clearBtn() {
    var $checkbox = $('input[type="checkbox"]');

    if ($checkbox.is(':checked') &&
        ($btnAll.hasClass('filter__btn_current') || $btnCompleted.hasClass('filter__btn_current'))
    ) {
        $btnClear.addClass('visible');
    } else {
        $btnClear.removeClass('visible');
    }
}

/**
 * Добавление нового пункта списка
 * по нажатию кнопки 'Add to list' или enter
 */
$btn.on('click', function(event) {
    event.preventDefault();

    if ($input.val().length > 0) {
        $list.prepend(
            '<li class="list-item">' +
                '<label>' +
                    '<input type="checkbox">' +
                    '<span></span>' +
                    $input.val() +
                '</label>' +
                '<button type="button" class="close-btn"></button>'+
            '</li>'
        );

        $input.val('');
        updateCounter();
    } else {
        // если уже был запущен setTimeout,
        // то необходимо остановить предыдущий
        // до запуска нового
        clearTimeout(shakeTimeout);

        // убрать класс shake через полсекунды
        shakeTimeout = setTimeout(function() {
            $wrapper.removeClass('shake');
        }, 500);

        $wrapper.addClass('shake');
    }

    if ($btnCompleted.hasClass('filter__btn_current')) {
        $('.list-item').not('.crossed').addClass('hide');
        $('.counter__value').text($('.crossed').length);
    }

    if ($btnActive.hasClass('filter__btn_current')) {
        $('.list-item').hasClass('crossed').addClass('hide');
    }
});

/**
 * Удаление элемента списка по нажатию крестика
 */
$list.on('click', '.close-btn', function(event) {
    event.preventDefault();
    $(this).closest('.list-item').remove();
    updateCounter();
});

/**
 * Выделение чекбокса по нажатию на элемент списка
 */
$list.on('click', '.list-item', function() {
    var $this = $(this);
    var $checkbox = $this.find('input[type="checkbox"]');
    var $label = $this.find('label');

    if ($checkbox.is(':checked')) {
        $checkbox.prop('checked', false);
        $label.removeClass('crossed');

    } else {
        $checkbox.prop('checked', true);
        $label.addClass('crossed');
    }

    updateCounter();

    if ($btnActive.hasClass('filter__btn_current')) {
        $this
            .not('.crossed')
            .addClass('hide')
            .removeClass('show');
    }

    if ($btnCompleted.hasClass('filter__btn_current')) {
        $this
            .has('.crossed')
            .addClass('show')
            .removeClass('hide');

        $this
            .not('.crossed')
            .addClass('hide')
            .removeClass('show');

        $('.counter__value').text($('.crossed').length);
    }

    clearBtn();
});

/**
 * Фильтр
 */
$btnCompleted.on('click', function(event) {
    event.preventDefault();

    var $listItem = $('.list-item');

    $filterButton.removeClass('filter__btn_current');
    $btnCompleted.addClass('filter__btn_current');
    $btnClear.addClass('visible');

    $listItem
        .not('.crossed')
        .addClass('hide')
        .removeClass('show');

    $listItem
        .has('.crossed', '.hide')
        .addClass('show')
        .removeClass('hide');

    $('.counter__value').text($('.crossed').length);
});

$btnActive.on('click', function(event) {
    event.preventDefault();
    clearBtn();

    var $listItem = $('.list-item');

    $filterButton.removeClass('filter__btn_current');
    $btnActive.addClass('filter__btn_current');
    $btnClear.removeClass('visible');

    $listItem
        .not('.crossed', '.hide')
        .addClass('show')
        .removeClass('hide');

    $listItem
        .has('.crossed', '.hide')
        .addClass('hide')
        .removeClass('show');

    updateCounter();
});

$btnAll.on('click', function(event) {
    event.preventDefault();

    var $listItem = $('.list-item');

    $filterButton.removeClass('filter__btn_current');
    $btnAll.addClass('filter__btn_current');

    $list.find($listItem).removeClass('hide').addClass('show');

    updateCounter();
    clearBtn();
});

/**
 * Кнопка удаления всех законченных дел
 */
$btnClear.on('click', function(event) {
    event.preventDefault();
    var $listItem = $('.list-item');

    $listItem.has('.crossed').remove();

    clearBtn();
    updateCounter();
});

/**
 * Кнопка выделения всех элементов списка
 */
var $checkAll = $('.check-all');

$checkAll.on('click', function(event) {
    event.preventDefault();

    var $checkbox = $('input[type="checkbox"]');
    var $label = $('label');
    var $checkedCheckbox = $checkbox.filter(':checked');

    if ($checkedCheckbox.length === $checkbox.length) {
        $checkbox.prop('checked', false);
        $label.removeClass('crossed');
    } else {
        $checkbox.prop('checked', true);
        $label.addClass('crossed');
    }

    clearBtn();
    updateCounter();
});
