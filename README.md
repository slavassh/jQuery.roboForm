jQuery.roboForm
============

The programmer forms. Check validity and the connection to the server.

	$.roboForm()
	
Примеры | Examples:

	.roboForm = форма для валидации | form for validate
	data-roborules = Правила валидации | rules of validate
	data-robomessage = Приоритетный текст ошибки | Priority error text
	data-range = диапазон символов через тире, напр. 5-6 или точное число | a range of characters using a dash, eg. 5-6, or the exact number

	<input data-roborules="email required" type="email" name="email" />
	
	email - проверить поле на правильный e-mail | is email
	required - поле обязательно к заполнению и не может быть пустым | is required
	phone - проверяем телефон
	integer - только целые числа
	float - только числа
	cyrillic - только киррилица
	range - диапазон или точное количество символов | the range or the exact number of characters
	
	pattern - соотвествует ли рег. выражению
	<input data-roborules="pattern required" data-robopattern="^test_" type="text" value="test_"/> // true

Параметры | Options:

	// classes
	field: ':input[data-roborules]', // поле для валидации | fields for validate
	errorElement: '.roboForm_error', // error box
	errorVisible: '.roboForm_show', // class for show an error box

	i18n: {
        ru: {
            mess_noRequired     : 'Заполните поле',
            mess_noRequiredCheck: 'Отметьте поле',
            mess_noEmail        : 'Укажите почту правильно',
            mess_noPhone        : 'Укажите номер правильно',
            mess_noPattern      : 'Заполните поле правильно',
            mess_noInteger      : 'Можно вводить только целое число',
            mess_noFloat        : 'Можно вводить только целое число или число с плавающей точкой',
            mess_noCyrillic     : 'Допускаются только символы кириллицы, цифры и символы -_.,?!',
            mess_range          : 'Укажите $1 цифр'
        },
        en: {
            mess_noRequired     : 'Fill in the field',
            mess_noRequiredCheck: 'Check the box',
            mess_noEmail        : 'E-mail is incorrect',
            mess_noPhone        : 'Number is incorrect',
            mess_noPattern      : 'Fill in the field',
            mess_noInteger      : 'You can only enter an integer',
            mess_noFloat        : 'You can enter only integer or floating point number',
            mess_noCyrillic     : 'Allowed only Latin symbols, numbers, and symbols -_.,?!',
            mess_range          : 'Only $1 digits'
        }
    }

	// system
	isNotification: true, // показывать уведомления при режиме ajax | live notification use ajax
	isNotificationAjaxError: false, // показываь ошибки при режиме ajax | live error use ajax
	isMyNoty: $.isFunction($.miniNoty) // расширение, плагин уведомлений | is use https://github.com/stepanmas/jQuery.miniNoty

События, вызываются для .roboForm | Call event for .roboForm:

	roboForm.ajax.success - Если выбран режим ajax, то вызывается это событие. Аргумент res.response содержит ответ от сервера. | res.response contains answer of server
	roboForm.valid.true - форма валидна | all right
	roboForm.valid.false - форма не валидна | all bad
	
Methods:

	// Add rule for check of validate for form(tag form) and cnf is current config of roboForm
	$.roboFormAddRule(function(form, cnf){
		return true // false if not valid that to prevent submit of event
	})


Лицензия
--------------
MIT