jQuery.roboForm
============

Автоматизатор форм. Проверка валидности и связь с сервером

	$.roboForm()
	
Примеры:

	.roboForm = форма для валидации
	data-roborules = Правила валидации
	data-robomessage = Приоритетный текст ошибки
	data-range = диапазон символов через тире, напр. 5-6 или точное число

	<input data-roborules="email required" type="email" name="email" />
	
	email - проверить поле на правильный e-mail
	required - поле обязательно к заполнению и не может быть пустым
	phone - проверяем телефон
	integer - только целые числа
	float - только числа
	cyrillic - только киррилица
	range - диапазон или точное количество символов
	
	pattern - соотвествует ли рег. выражению
	<input data-roborules="pattern required" data-robopattern="^test_" type="text" value="test_"/> // true

Параметры:

	// классы
	field: ':input[data-roborules]', // поле для валидации
	errorElement: '.roboForm_error', // элемент сразу после поля куда записывается текст ошибки
	errorVisible: '.roboForm_show', // класс для показа ошибки

	// сообщения
	mess_noRequired: 'Заполните поле', // поле обязательно к заполнению
	mess_noEmail: 'Укажите почту правильно', // не верно указана почта
	mess_noPhone: 'Укажите номер правильно', // телефон
	mess_noPattern: 'Заполните поле правильно', // не соотвествует ругулярному выражению
	mess_noInteger: 'Можно вводить только целое число',
    mess_noFloat: 'Можно вводить только целое число или число с плавающей точкой',
    mess_noCyrillic: 'Допускаются только символы кириллицы, цифры и символы -_.,?!',
    mess_range: 'Укажите $1 цифр',

	// system
	isNotification: true, // показывать уведомления при режиме ajax
	isNotificationAjaxError: false, // показываь ошибки при режиме ajax
	isMyNoty: $.isFunction($.miniNoty) // расширение, плагин уведомлений

События, вызываются для .roboForm:

	roboForm.ajax.success - Если выбран режим ajax, то вызывается это событие. Аргумент res.response содержит ответ от сервера.
	roboForm.valid.true - форма валидна
	roboForm.valid.false - форма не валидна
	
Methods:

	// Add rule for check of validate for form(tag form) and cnf is current config of roboForm
	$.roboFormAddRule(function(form, cnf){
		return true // false if not valid that to prevent submit of event
	})


Лицензия
--------------
MIT