/**
 * jQuery.roboForm v0.52.2
 * @desc: Автоматизатор форм. Проверка валидности и связь с сервером
 * Сайт плагина - https://github.com/StepanMas/jQuery.roboForm
 */

;(function($){

	$.roboForm = function(cnf){

		var _prop = {
				formCls: '.roboForm',

				field: ':input[data-roborules]',
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
			},
			body = $('body')


		// classes
		_prop.errorElementClass = _prop.errorElement.replace('.', '')
		_prop.errorVisibleClass = _prop.errorVisible.replace('.', '')

		var cnf = $.extend(_prop, cnf)

		body.on('submit', cnf.formCls, function() {

			var form = $(this),
				isValid = true

			// пробераемся по полям форм
			$(cnf.field, this).each(function () {

				var _this = $(this),
					el_error = _this.next(),
					value = $.trim(_this.val()),
					rules = _this.data('roborules')


				// удаляем прошлые уведомления
				_this.removeClass(cnf.errorElementClass)
				if (el_error.length && el_error.hasClass(cnf.errorVisibleClass))
					el_error.removeClass(cnf.errorVisibleClass)


				// валидируем
				if (hasRules('required', rules) && value === '')
					isValid = exceptionError(_this, cnf.mess_noRequired)

				else if (hasRules('email', rules) && (hasRules('required', rules) || value !== '')) {

					var regexp = /^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,4}$/i;

					if (!regexp.test(value)) isValid = exceptionError(_this, cnf.mess_noEmail)

				}

				else if (hasRules('phone', rules) && (hasRules('required', rules) || value !== '')) {

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

			if (!isValid) {

				form.trigger({
					type: 'roboForm.valid.false'
				})

				return false;
			}
			else
			{
				form.trigger({
					type: 'roboForm.valid.true'
				})
			}

			if ($(this).data('ajax')) {

				$.ajax({
					type: $(this).attr('method') || 'POST',
					data: $(this).serialize(),
					url: $(this).attr('action'),
					success: function (res) {

						try {
							res = $.parseJSON(res)
						} catch (e) {
							console.log(e)
						}

						if (cnf.isNotification) {
							try {

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

						form.trigger({
							type: 'roboForm.ajax.success',
							response: res
						})

					},
					error: function (e) {

						if (cnf.isNotificationAjaxError) {

							var text_error = e.status + ': ' + e.statusText
							if (cnf.isMyNoty) $.miniNoty(text_error, 'error')
							else alert(text_error)

						}

					}
				})

				return false;
			}

		})

		body.on('click', cnf.errorElement, function () {
			$(this).removeClass(_prop.errorVisible.replace('.', ''))
		})

		body.on('focus', cnf.field, function () {
			$(this).next().removeClass('roboForm_show')
		})

		// функций
		var exceptionError = function(field, message){

				$('input[type="submit"], .createEvent[data-event="submit"]')
					.removeClass('loader')

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