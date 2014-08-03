/**
 * jQuery.roboForm v0.2
 * @desc: Автоматизатор форм. Проверка валидности и связь с сервером
 * Сайт плагина - https://github.com/StepanMas/jQuery.roboForm
 */

;(function($){

	$.fn.roboForm = function(cnf){

		var _prop = {

			field: '.roboForm_field',
			errorElement: '.roboForm_error',
			errorVisible: '.roboForm_show',

			// error message
			mess_noRequired: 'Заполните поле',
			mess_noEmail: 'Укажите почту правильно',
			mess_noPhone: 'Укажите номер правильно',
			mess_noPattern: 'Заполните поле правильно',
			mess_noInteger: 'Можно вводить только целое число',
			mess_noFloat: 'Можно вводить только целое число или число с плавающей точкой',

			// system
			isNotification: true,
			isNotificationAjaxError: false,
			isMyNoty: $.isFunction($.miniNoty)
		}


		// classes
		_prop.errorElementClass = _prop.errorElement.replace('.', '')
		_prop.errorVisibleClass = _prop.errorVisible.replace('.', '')

		var cnf = $.extend(_prop, cnf)

		// пробегаемся по элементам form
		this.each(function(){

			var form = $(this)

			form.submit(function(e){

				var isValid = true

				// пробераемся по полям форм
				$(cnf.field, this).each(function () {

					var _this = $(this),
						el_error = _this.next(),
						value = $.trim(_this.val()),
						rules = _this.data('roborules')


					// удаляем прошлые уведомления
					_this.removeClass(cnf.errorElementClass)
					if(el_error.length && el_error.hasClass(cnf.errorVisibleClass))
						el_error.removeClass(cnf.errorVisibleClass)


					// валидируем
					if(hasRules('required', rules) && value === '')
						isValid = exceptionError(_this, cnf.mess_noRequired)

					else if (hasRules('email', rules) && (hasRules('required', rules) || value !== ''))
					{

						var regexp = /^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,4}$/i;

						if(!regexp.test(value)) isValid = exceptionError(_this, cnf.mess_noEmail)

					}

					else if (hasRules('phone', rules) && (hasRules('required', rules) || value !== ''))
					{

						if (!/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(value))
							isValid = exceptionError(_this, cnf.mess_noPhone)

					}

					else if (hasRules('integer', rules) && (hasRules('required', rules) || value !== '')) {

						if (!/^\d+$/.test(value))
							isValid = exceptionError(_this, cnf.mess_noInteger)

					}

					else if (hasRules('float', rules) && (hasRules('required', rules) || value !== '')) {

						if (!/^(\d|\.)+$/.test(value))
							isValid = exceptionError(_this, cnf.mess_noFloat)

					}

					else if (hasRules('pattern', rules) && (hasRules('required', rules) || value !== '')) {

						var regexp = new RegExp(_this.data('robopattern'));

						if (!regexp.test(value))
							isValid = exceptionError(_this, cnf.mess_noPattern)

					}

				})

				if(!isValid) return false;

				if($(this).data('ajax'))
				{

					$.ajax({
						type: $(this).attr('method') || 'POST',
						data: $(this).serialize(),
						url: $(this).attr('action'),
						success: function(res){

							if(cnf.isNotification)
							{
								try {

									res = $.parseJSON(res)
									if (res.success) {

										if (cnf.isMyNoty) $.miniNoty(res.success, 'success')
										else alert(res.success)

									}

									else if (res.error) {

										if (cnf.isMyNoty) $.miniNoty(res.error, 'error')
										else alert(res.error)

									}
								}
								catch (e) {
									console.error(e, 'jQuery.roboForm expects an JSON array')
								}
							}

						},
						error: function(e){

							if(cnf.isNotificationAjaxError)
							{

								var text_error = e.status + ': ' + e.statusText
								if (cnf.isMyNoty) $.miniNoty(text_error, 'error')
								else alert(text_error)

							}

						}
					})

					return false;
				}
			})

		})


		// функций
		var exceptionError = function(field, message){

				if(field.data('robomessage'))
					message = field.data('robomessage')

				field.addClass(cnf.errorElementClass)
				console.error(message, field)

				var el_error = field.next()

				if(el_error.length && el_error.hasClass(cnf.errorElementClass))
				{
					el_error.html(message)
				}

				else
				{
					var el_error = document.createElement('div')
					el_error.setAttribute('class', cnf.errorElementClass)
					el_error.innerHTML = message

					field.after(el_error)
				}

				cnf.isValid = false
				$(el_error).addClass(cnf.errorVisibleClass)

				return false;
			},

			hasRules = function(rules, source){

				if(source !== undefined && source.indexOf(rules) !== -1)
					return true;

				else
					return false;
			}

	}

})(jQuery);