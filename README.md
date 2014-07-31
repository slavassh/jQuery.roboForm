jQuery.roboForm
============

Автоматизатор форм. Проверка валидности и связь с сервером

	$('.roboForm').roboForm()
	
Примеры:

	data-roborules = Правила валидации
	data-robomessage = Приоритетный текст ошибки

	<input data-roborules="email required" class="roboForm_field" type="email" name="email" />
	
	email - проверить поле на правильный e-mail
	required - поле обязательно к заполнению и не может быть пустым
	phone - проверяем телефон
	
	pattern - соотвествует ли рег. выражению
	<input data-roborules="pattern required" data-robopattern="^test_" class="roboForm_field" type="text" value="test_"/> // true

Параметры:

	// классы
	field: '.roboForm_field', // поле для валидации
	errorElement: '.roboForm_error', // элемент сразу после поля куда записывается текст ошибки
	errorVisible: '.roboForm_show', // класс для показа ошибки

	// сообщения
	mess_noRequired: 'Заполните поле', // поле обязательно к заполнению
	mess_noEmail: 'Укажите почту правильно', // не верно указана почта
	mess_noPhone: 'Укажите номер правильно', // телефон
	mess_noPattern: 'Заполните поле правильно', // не соотвествует ругулярному выражению

	// system
	isNotification: true, // показывать уведомления при режиме ajax
	isNotificationAjaxError: false, // показываь ошибки при режиме ajax
	isMyNoty: $.isFunction($.miniNoty) // расширение, плагин уведомлений



Лицензия
--------------
MIT