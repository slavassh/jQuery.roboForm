;(function ($)
{
    "use strict";
    
    $.roboForm = function (cnf)
    {
        
        var _prop = {
                formCls: '.roboForm',
            
                field       : ':input[data-roborules]:visible',
                errorElement: '.roboForm_error',
                errorVisible: '.roboForm_show',
            
                lang: 'en',
            
                // error message
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
                },
            
                // system
                isNotification         : true,
                isNotificationAjaxError: false,
                isMyNoty               : $.isFunction($.miniNoty)
            },
            doc   = $(document);
        
        
        // classes
        _prop.errorElementClass = _prop.errorElement.replace('.', '');
        _prop.errorVisibleClass = _prop.errorVisible.replace('.', '');
        
        cnf = $.extend(_prop, cnf);
        
        doc.on(
            'submit', cnf.formCls, function ()
            {
                
                var form    = $(this),
                    isValid = true;
                
                // пробераемся по полям форм
                $(cnf.field, this).each(
                    function ()
                    {
                        
                        var _this    = $(this),
                            el_error = _this.next(),
                            value    = $.trim(_this.val()),
                            rules    = _this.data('roborules'),
                            regexp;
                        
                        
                        // удаляем прошлые уведомления
                        _this.removeClass(cnf.errorElementClass);
                        if (el_error.length && el_error.hasClass(cnf.errorVisibleClass))
                            el_error.removeClass(cnf.errorVisibleClass);
                        
                        
                        // валидируем
                        if (hasRules('required', rules) && value === '')
                            isValid = exceptionError(_this, cnf.i18n[cnf.lang].mess_noRequired);
                        
                        if (_this.is(':checkbox, :radio') && hasRules('required', rules) && !_this.is(':checked'))
                            isValid = exceptionError(_this, cnf.i18n[cnf.lang].mess_noRequiredCheck);
                        
                        if (hasRules('email', rules) && (hasRules('required', rules) || value !== ''))
                        {
                            
                            regexp = /^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,4}$/i;
                            
                            if (!regexp.test(value)) isValid = exceptionError(_this, cnf.i18n[cnf.lang].mess_noEmail)
                            
                        }
                        
                        if (hasRules('phone', rules) && (hasRules('required', rules) || value !== ''))
                        {
                            
                            if (!/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(value))
                                isValid = exceptionError(_this, cnf.i18n[cnf.lang].mess_noPhone)
                            
                        }
                        
                        if (hasRules('integer', rules) && (hasRules('required', rules) || value !== ''))
                        {
                            
                            if (!/^\d+$/.test(value))
                                isValid = exceptionError(_this, cnf.i18n[cnf.lang].mess_noInteger)
                            
                        }
                        
                        if (hasRules('float', rules) && (hasRules('required', rules) || value !== ''))
                        {
                            
                            if (!/^(\d|\.)+$/.test(value))
                                isValid = exceptionError(_this, cnf.i18n[cnf.lang].mess_noFloat)
                            
                        }
                        
                        if (hasRules('cyrillic', rules) && (hasRules('required', rules) || value !== ''))
                        {
                            
                            if (!/^[а-яё\d\s-_.,\?!]+$/i.test(value))
                                isValid = exceptionError(_this, cnf.i18n[cnf.lang].mess_noCyrillic)
                            
                        }
                        
                        if (hasRules('range', rules) && (hasRules('required', rules) || value !== ''))
                        {
                            
                            var range = _this.data('range').toString();
                            
                            if (range.indexOf('-') !== -1)
                            {
                                
                                range = range.split('-');
                                
                                if (value.length < parseInt(range[0]) || value.length > parseInt(range[1]))
                                    isValid = exceptionError(_this, cnf.i18n[cnf.lang].mess_range.replace('$1', _this.data('range')))
                                
                            }
                            else
                                if (range.indexOf('|') !== -1)
                                {
                                    
                                    range      = range.split('|');
                                    var orFlag = false;
                                    
                                    $.each(
                                        range, function (i, val)
                                        {
                                            if (val === value.length)
                                            {
                                                orFlag = true;
                                                return false;
                                            }
                                        }
                                    );
                                    
                                    if (!orFlag)
                                        isValid = exceptionError(
                                            _this, cnf.i18n[cnf.lang].mess_range.replace('$1', _this.data('range'))
                                        );
                                }
                                else
                                {
                                    
                                    if (value.length !== parseInt(range))
                                        isValid = exceptionError(
                                            _this, cnf.i18n[cnf.lang].mess_range.replace('$1', _this.data('range'))
                                        );
                                    
                                }
                            
                        }
                        
                        if (hasRules('pattern', rules) && (hasRules('required', rules) || value !== ''))
                        {
                            
                            regexp = new RegExp(_this.data('robopattern'));
                            
                            if (!regexp.test(value))
                                isValid = exceptionError(_this, cnf.i18n[cnf.lang].mess_noPattern)
                            
                        }
                        
                    }
                );
                
                if (!isValid)
                {
                    
                    form.trigger(
                        {
                            type: 'roboForm.valid.false'
                        }
                    );
                    
                    return false;
                }
                
                isValid = $._roboFormRules(form, cnf);
                
                if (isValid)
                    form.trigger(
                        {
                            type: 'roboForm.valid.true'
                        }
                    );
                
                if (isValid && $(this).data('ajax') && !$(this).prop('disabled') && !$(this).hasClass('disabled'))
                {
                    
                    $.ajax(
                        {
                            type   : $(this).attr('method') || 'POST',
                            data   : $(this).serialize(),
                            url    : $(this).attr('action'),
                            success: function (res)
                            {
                                
                                try
                                {
                                    res = $.parseJSON(res);
                                }
                                catch (e)
                                {
                                    throw new Error(e);
                                }
                                
                                if (cnf.isNotification)
                                {
                                    try
                                    {
                                        
                                        if (res.success)
                                        {
                                            
                                            if (cnf.isMyNoty) $.miniNoty(res.success, 'success');
                                            else alert(res.success);
                                            
                                        }
                                        
                                        else
                                            if (res.error)
                                            {
                                                
                                                if (cnf.isMyNoty) $.miniNoty(res.error, 'error');
                                                else alert(res.error);
                                                
                                            }
                                    }
                                    catch (e)
                                    {
                                        console.error(e, 'jQuery.roboForm expects an JSON array');
                                    }
                                }
                                
                                form.trigger(
                                    {
                                        type    : 'roboForm.ajax.success',
                                        response: res
                                    }
                                );
                                
                            },
                            error  : function (e)
                            {
                                
                                if (cnf.isNotificationAjaxError)
                                {
                                    
                                    var text_error = e.status + ': ' + e.statusText;
                                    if (cnf.isMyNoty) $.miniNoty(text_error, 'error');
                                    else alert(text_error);
                                    
                                }
                                
                            }
                        }
                    );
                    
                    return false;
                }
                
                return isValid;
            }
        );
        
        doc.on(
            'click', cnf.errorElement, function ()
            {
                $(this).removeClass(_prop.errorVisibleClass).prev().removeClass(_prop.errorElementClass)
            }
        );
        
        doc.on(
            'focus', cnf.field, function ()
            {
                $(this).removeClass(_prop.errorElementClass).next().removeClass(_prop.errorVisibleClass)
            }
        );
        
        // функций
        var exceptionError = function (field, message)
            {
            
                $('input[type="submit"], .createEvent[data-event="submit"]')
                    .removeClass('loader');
            
                if (field.data('robomessage'))
                    message = field.data('robomessage');
            
                field.addClass(cnf.errorElementClass);
                console.error(message, field);
            
                var el_error = field.next();
            
                if (el_error.length && el_error.hasClass(cnf.errorElementClass))
                {
                    el_error.html(message);
                }
            
                else
                {
                    el_error = document.createElement('div');
                    el_error.setAttribute('class', cnf.errorElementClass);
                    el_error.innerHTML = message;
                
                    field.after(el_error);
                }
            
                cnf.isValid = false;
                $(el_error).addClass(cnf.errorVisibleClass);
            
                return false;
            },
        
            hasRules       = function (rules, source)
            {
                return source !== undefined && source.indexOf(rules) !== -1;
            };
        
    };
    
    $._roboFormRules  = function (){return true;};
    $.roboFormAddRule = function (rule)
    {
        $._roboFormRules = rule;
        return this;
    };
    
})(jQuery);