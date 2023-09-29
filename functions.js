/*
* @license Intercloudy 2016
* Copyright (C) 2016 Intercloudy
* Author: Eduardo Villa
* Last Update: 2017-09-26
*/

var selectorButacas = "";
var countDownTimer = new Date("Sep 5, 2018 00:00:00").getTime();
var lastInsertedId = 0;
var flagTimer = false;
var timerSet;
var coddescusados = "";
var itc = {
	version: '0.1.0',
	/*
	* VARIABLES
	*/
	id_formulario: 0,
	idColIns: 0,
	invitacion: 0,
	id_inscripcion: 0,
	ultimoPaso: 0,
	id_categoria_seleccionada: 0,
	id_precio_seleccionada: 0,
	precio_categoria_seleccionada: 0,
	timer: null,
	gvalidar_beca: true,
	arregloListaAsociada: [],
	resultado: true,
	resultadoEMAIL: true,
	validarEmail: true,
	validarDNI: true,
	dataresultadoDNI: {},
	resultadoDNI: true,
	searchingData: false,
	onajaxload: false,
	valoranterior: '',
	emailBigData: '',
	inscrBigData: {},
	invitado: '',
	datos_documento: '',
	contadorGeneral: 0,
	limiteColaboradores: 0,
	idUsuario: 0,
	categorias: {},
	datosFormasPagos: {},
	monedas_formulario: {},
	dependencias: [],
	cantidad_x_paso: {},
	cantidad_x_paso_sob: {},
	paso_categorias_bon: {},
	click_cat_order: [],
	id_moneda: 0,
	recargo: 0,
	porcentajedescuento: 0,
	useasprice: 0,
	categoriasdescuento: [],
	sin_cargo: 0,
	Total: 0,
	minTimer: 0,
	selectedTribuna: [],
	butacasOcupadas: {},
	butacasReservadas: {},
	gruposLimite: {},
	cdep: {},
	btncatelement: '',
	codigodescuento: {
		msg: 'CÃ³digo de descuento invÃ¡lido o ya utilizado',
		code: '',
		state: false,
		data: {}
	},

	codigoxcategoria: {
		msg: 'CÃ³digo invÃ¡lido o ya utilizado',
		code: '',
		state: false,
		data: {}
	},
	dependencias_grupos: {},
	grupos_dep_categorias: {},
	arrayButacas: {},
	lastInsertedId: {},
	formVar: '',
	Formvalidator: null,
	resultadoAPI: false,
	resultadoVINSC: false,
	campostemarow: 1,
	submit_flag: true,
	habilitar_bigdata: false,
	mensaje_validator: '',
	apiData: {},
	contadorPalabras: 3000,
	tipocontadorPalabras: 'Palabras',
	contadorPalabrasTrabajos: 350,
	tipocontadorPalabrasTrabajos: 'Palabras',
	maxFileSize: 5000,
	onReady: false,
	alertanotifiacion: false,

	/*
	* FUNCIONES
	*/
	datos_colaborador: function (id_form, id_insc) {

		$.ajax({
			url: itc.siteurl + "rest/v1/obtenerColaborador",
			type: 'PUT',
			dataType: 'json',
			data: { idform: id_form, idinsc: id_insc, _token: itc._token },
			success: function (e) {
				return console.log(e);
			},
			error: function (e) {
				return console.log(e);
			},
		});

	},
	_sett: function (lbl, val) {
		if (this.trans[lbl] != 'undefined')
			return this.trans[lbl] = val;
	},
	_t: function (lbl) {
		if (this.trans[lbl] != 'undefined')
			return this.trans[lbl] ? this.trans[lbl] : '';
	},
	_alertbox: function (txt) {
		jQuery('#alert_message').html(txt);
		jQuery('#myAlertMessage').modal('show');
	},
	/*
	* Valida metodo de pago
	*/
	isValidMP: function (imp) {
		imp = parseInt(imp);
		for (k = 0; k < itc.datosFormasPagos.length; k++) {
			if (itc.datosFormasPagos[k].id_forma_pago == imp)
				return true;
		}
		return false;
	},

	/*
	* Habilita Categoria
	*/
	enableCategoria: function (el, catid, idmon) {
		id_group = $(el).data('groupid');
		// $(el).text(itc._t('categoria_deseleccionar'));
		if (itc.trans['categoria_deseleccionar_grupo'][id_group]) {
			$(el).text(itc.trans['categoria_deseleccionar_grupo'][id_group]);
		} else {
			$(el).text(itc._t('categoria_deseleccionar'));
		}
		$(el).removeClass('btn-success').addClass('btn-white');
		$('#categoria_' + idmon + '_' + catid).prop('checked', true);
		$('#cardcate_' + idmon + '_' + catid).removeClass('card-plain').addClass('card-raised');
		$('#contcate_' + idmon + '_' + catid).addClass('content-success');
		$('#dispcantcateg' + idmon + '_' + catid).removeClass('hide');
		$('#cantidad_categorias_' + idmon + '_' + catid).prop("disabled", false);
		$('.card-image').removeClass('card-click');
		$('#triggerSeats_' + idmon + '_' + catid).removeClass('hide');
		this.validarDependenciaCategoriaGrupo(true, catid);
	},

	/*
	* Disable Categoria
	*/
	disableCategoria: function (el, catid, idmon) {
		id_group = $(el).data('groupid');
		$('#labelButacas_' + idmon + '_' + catid).text('');
		if (itc.trans['categoria_seleccionar_grupo'][id_group]) {
			$(el).text(itc.trans['categoria_seleccionar_grupo'][id_group]);
		} else {
			$(el).text(itc._t('categoria_seleccionar'));
		}
		$(el).removeClass('btn-white').addClass('btn-success');
		var precio = parseFloat($('#categoria_' + idmon + '_' + catid).data('precio'));
		$('#categoria_' + idmon + '_' + catid).prop('checked', false);
		$('#cardcate_' + idmon + '_' + catid).removeClass('card-raised').addClass('card-plain');
		$('#contcate_' + idmon + '_' + catid).removeClass('content-success');
		$('#cantidad_categorias_' + idmon + '_' + catid).val('1').trigger('change.select2');
		$('#cantidad_categorias_' + idmon + '_' + catid).prop("disabled", true);
		$('#dispcantcateg' + idmon + '_' + catid).addClass('hide');
		$('#triggerSeats_' + idmon + '_' + catid).addClass('hide');
		$('.card-image').addClass('card-click');
		$("#msjcat" + idmon + "_" + catid).remove();

		if (precio < 0) {
			var cardtit = $('#contcate_' + idmon + '_' + catid + ' .card-title').data('cardtit');
			$('#contcate_' + idmon + '_' + catid + ' .card-title').html(cardtit);
		} else if (typeof itc.monedas_formulario[idmon] != 'undefined') {
			$('#contcate_' + idmon + '_' + catid + ' .card-title').html('<small>' + itc.monedas_formulario[idmon].signo + '</small> ' + parseFloat(precio).formatMoney(2, ',', '.'));
		}
		//borra butaca temporal
		var id_butaca_temp = $('[name="id_butaca_temp[' + id_group + '][' + catid + ']"]').val();
		// this.deleteButacas(id_butaca_temp);
		$('[name="id_butaca_temp[' + id_group + '][' + catid + ']"]').val('');
		this.validarDependenciaCategoriaGrupo(false, catid);
	},

	deleteButacas: function (id_butaca_temp) {
		$.ajax({
			url: itc.siteurl + "rest/v1/deleteButacas",
			type: "GET",
			data: { lastInsertedId: id_butaca_temp, _token: itc._token },
			dataType: "JSON",
			success: function (response) {
				console.log(response);
				if (response.error == 1) {
					console.log(response.mensaje);
				}
			}
		});
	},

	/*
	* Calcula total
	*/
	calculeTotal: function () {
		var Total = 0;
		var subTotal = 0;
		var descuento = 0;
		var descuentoporcategoria = false;
		var recargo = 0;
		var recargo_total = 0;
		var codigobecencontrado = false;
		var tienebonificacantidad = false;
		var cantidadcatimapgas = 0;
		itc.cantidad_x_paso = {};
		itc.cantidad_x_paso_sob = {};
		$('.porcen_descuento').parent().show();
		// $('.cate_part:checked').each(function(){

		// Limpiar la marca de 'cÃ³digo usado' antes de recalcular decuentos
		$.each(itc.codigodescuento.data, function (idcode, cd) {
			delete cd.codigo_usado;
		});

		$.each(itc.click_cat_order, function (k, v) {
			// debugger
			var cantidad = 1;
			var datoscat = v.split("_"); //0 paso,1 moneda, 2 categoria
			let element = $('#categoria_' + datoscat[1] + '_' + datoscat[2]);
			$('#categoriasc_' + datoscat[1] + '_' + datoscat[2]).remove();
			$('#codigoaplica_' + datoscat[1] + '_' + datoscat[2]).remove();
			$('#codigoaplicaprecio_' + datoscat[1] + '_' + datoscat[2]).remove();
			var pagada = parseInt($(element).data('catpaga'));
			if (pagada == 0) {
				cantidadcatimapgas++;
				// debugger
				var catid = String($(element).data('catid'));
				var idmon = parseInt($(element).data('idmon'));
				var npaso = String($(element).data('paso'));
				var paso = parseInt($(element).data('paso'));
				var precio = parseFloat($(element).data('precio'));
				let pasoparent = $('#paso_' + npaso);
				if (typeof itc.cantidad_x_paso[npaso] == "undefined") {
					itc.cantidad_x_paso[npaso] = 1;
				} else {
					itc.cantidad_x_paso[npaso]++;
				}
				var cntbon = cntbontemp = parseInt($('#paso_' + npaso).data('cntbon'));
				var cntbonsob = cntbonsobtemp = parseInt($('#paso_' + npaso).data('cntbonsob'));
				// cntbonmul = cntbon * ($('.cate_part:checked',pasoparent).length / cntbonsob);
				cntbonmul = cntbon * (itc.click_cat_order.length / cntbonsob);
				//tiene bonificaciones por cantidades de seleccion
				if (parseInt(cntbon) > 0 && parseInt(cntbonsob) > 0) {
					tienebonificacantidad = true;
				}
				if (typeof itc.cantidad_x_paso_sob[paso] == "undefined") {
					itc.cantidad_x_paso_sob[paso] = { 'cntbontemp': cntbon, 'cntbonsobtemp': cntbonsob };
				}

				// console.log(itc.cantidad_x_paso_sob)
				// revisa si alguna de las categorias tiene codigo BEC y almacena su uso para
				// permitir que las siguientes selecciones ya no invaliden
				// if(!codigobecencontrado){
				$.each(itc.codigodescuento.data, function (idcode, cd) {
					// if(typeof cd.codigo != 'undefined' && cd.codigo.match(/BEC/) != null && $.inArray( catid, cd.categorias ) >= 0){
					if (typeof cd.codigo != 'undefined' && $.inArray(catid, cd.categorias) >= 0 &&
						((parseInt(cd.ccaplica) > 0 && cantidadcatimapgas <= cd.ccaplica) || parseInt(cd.ccaplica) == 0)) {
						// debugger
						tienebonificacantidad = false;
						itc.cantidad_x_paso_sob[npaso].cntbonsobtemp++;
					}
				});
				// }

				// debugger
				if (cntbon > 0 && itc.cantidad_x_paso[npaso] <= cntbon && (cntbonsob <= 0)) {
					$('#contcate_' + idmon + '_' + catid + ' .card-title').html('<small>' + itc.monedas_formulario[idmon].signo + '</small> ' + parseFloat(0).formatMoney(2, ',', '.'));
					return;
				}
				else if (cntbon > 0 && cntbonsob > 0
					&& itc.cantidad_x_paso_sob[npaso].cntbonsobtemp <= itc.cantidad_x_paso_sob[npaso].cntbontemp
					// && (  itc.codigodescuento.state == false ||  codigobecencontrado == false)
				) {
					// codigobecencontrado = false;
					$('#contcate_' + idmon + '_' + catid + ' .card-title').html('<small>' + itc.monedas_formulario[idmon].signo + '</small> ' + parseFloat(0).formatMoney(2, ',', '.'));
					$('#categoria_' + idmon + '_' + catid + '').after('<input type="hidden" name="categoriasc[' + idmon + '][' + catid + ']" id="categoriasc_' + idmon + '_' + catid + '" value="1"/>')
					itc.paso_categorias_bon[idmon] = {};
					itc.paso_categorias_bon[idmon][catid] = true;
					itc.cantidad_x_paso_sob[npaso].cntbonsobtemp--;
					if (itc.cantidad_x_paso_sob[npaso].cntbonsobtemp == 0) {
						itc.cantidad_x_paso_sob[npaso] = { 'cntbontemp': cntbon, 'cntbonsobtemp': cntbonsob };
					}
					return;
				}
				else if (precio < 0) {
					var cardtit = $('#contcate_' + idmon + '_' + catid + ' .card-title').data('cardtit');
					$('#contcate_' + idmon + '_' + catid + ' .card-title').html(cardtit);
				} else {
					$('#contcate_' + idmon + '_' + catid + ' .card-title').html('<small>' + itc.monedas_formulario[idmon].signo + '</small> ' + parseFloat(precio).formatMoney(2, ',', '.'));
				}
				if ($('#cantidad_categorias_' + idmon + '_' + catid).val() > 1) {
					cantidad = $('#cantidad_categorias_' + idmon + '_' + catid).val();
				} else if ($('#cantidad_categorias_' + idmon + '_' + catid).data('cantidadselected') > 1) {
					cantidad = $('#cantidad_categorias_' + idmon + '_' + catid).data('cantidadselected');
				}

				if (cntbon > 0 && cntbonsob > 0) {
					itc.cantidad_x_paso_sob[npaso].cntbonsobtemp--;
					if (itc.cantidad_x_paso_sob[npaso].cntbonsobtemp == 0) {
						itc.cantidad_x_paso_sob[npaso] = { 'cntbontemp': cntbon, 'cntbonsobtemp': cntbonsob };
					}
				}

				var preciocantidad = 0;
				if (precio > 0) {
					preciocantidad = (parseFloat(precio) * cantidad);
					subTotal = subTotal + preciocantidad;
					if (itc.recargo) {
						recargo = itc.recargo * preciocantidad / 100;
						recargo_total = recargo_total + recargo;
						preciocantidad = preciocantidad + recargo;
					}
					Total = Total + preciocantidad;
				}
				// console.log((k+1),itc.codigodescuento.data.ccaplica)
				// verifica si el descuento aplica a n categorias
				let cantidadcodigoaplicado = 0;
				$.each(itc.codigodescuento.data, function (idcode, cd) {
					// debugger

					let porcentaje = parseFloat(cd.porcentaje);
					let categoriasdescuento = cd.categorias;
					let useasprice = cd.useasprice;

					if ((cd.ccaplica == 0) || (cd.ccaplica == '') ||
						(parseInt(cd.ccaplica) > 0 && cantidadcatimapgas <= cd.ccaplica)) {
						// Calcula descuento por categoria
						if ($.inArray(catid, categoriasdescuento) >= 0 && porcentaje > 0 && precio >= 0 && useasprice == 0
							&& (cd.id_moneda > 0 && cd.id_moneda == idmon)) {
							descuentoporcategoria = true;
							descuento = descuento + (porcentaje * preciocantidad / 100);
							cantidadcodigoaplicado++;
							if (porcentaje == 100) {
								$('#categoria_' + idmon + '_' + catid + '').after('<input type="hidden" name="codigoaplica[' + idmon + '][' + catid + ']" id="codigoaplica_' + idmon + '_' + catid + '" value="' + cd.codigo + '"/>')
							}
						} else if ($.inArray(catid, categoriasdescuento) >= 0 && porcentaje > 0 && precio >= 0 && useasprice == 0) {
							//Si es porcentaje no debe revisar moneda
							descuentoporcategoria = true;
							descuento = descuento + (porcentaje * preciocantidad / 100);
							cantidadcodigoaplicado++;
							if (porcentaje == 100) {
								$('#categoria_' + idmon + '_' + catid + '').after('<input type="hidden" name="codigoaplica[' + idmon + '][' + catid + ']" id="codigoaplica_' + idmon + '_' + catid + '" value="' + cd.codigo + '"/>')
							}
						} else if ($.inArray(catid, categoriasdescuento) >= 0 && porcentaje > 0 && precio >= 0 && useasprice == 1
							&& ('undefined' == typeof cd.codigo_usado || !cd.codigo_usado) && (cd.id_moneda > 0 && cd.id_moneda == idmon)) {
							descuentoporcategoria = true;
							cd.codigo_usado = true;
							// descuento = descuento + (itc.porcentajedescuento - parseFloat($(this).data('precio')));
							descuento = descuento + porcentaje;
							cantidadcodigoaplicado++;
							$('#categoria_' + idmon + '_' + catid + '').after('<input type="hidden" name="codigoaplicaprecio[' + idmon + '][' + catid + ']" id="codigoaplicaprecio_' + idmon + '_' + catid + '" value="' + cd.codigo + '"/>')
						}
					}
				});
				//codigo antes de codigos multiples
				// if((itc.codigodescuento.data.ccaplica == 0) || (itc.codigodescuento.data.ccaplica == '') ||
				// 	(parseInt(itc.codigodescuento.data.ccaplica) > 0 && (k+1) <= itc.codigodescuento.data.ccaplica)){
				// 	// Calcula descuento por categoria
				// 	if($.inArray( catid, itc.categoriasdescuento ) >= 0 && itc.porcentajedescuento > 0 && precio >= 0 && itc.useasprice == 0
				// 		&& (itc.codigodescuento.data.id_moneda > 0 && itc.codigodescuento.data.id_moneda == idmon)){
				// 		descuentoporcategoria = true;
				// 		descuento = descuento + (itc.porcentajedescuento * preciocantidad / 100);
				// 	}else if($.inArray( catid, itc.categoriasdescuento ) >= 0 && itc.porcentajedescuento > 0 && precio >= 0 && itc.useasprice == 0){
				// 		//Si es porcentaje no debe revisar moneda
				// 		descuentoporcategoria = true;
				// 		descuento = descuento + (itc.porcentajedescuento * preciocantidad / 100);
				// 	}else if($.inArray( catid, itc.categoriasdescuento ) >= 0 && itc.porcentajedescuento > 0 && precio >= 0 && itc.useasprice == 1
				// 				&& descuento < itc.porcentajedescuento && (itc.codigodescuento.data.id_moneda > 0 && itc.codigodescuento.data.id_moneda == idmon)){
				// 		descuentoporcategoria = true;
				// 		// descuento = descuento + (itc.porcentajedescuento - parseFloat($(this).data('precio')));
				// 		descuento = descuento + itc.porcentajedescuento;
				// 	}
				// }
			} else if (pagada == 1) {
				// var catid = String($(element).data('catid'));
				// var idmon = parseInt($(element).data('idmon'));
				// var npaso = String($(element).data('paso'));
				// var paso = parseInt($(element).data('paso'));
				// var precio = parseFloat($(element).data('precio'));
				// let pasoparent = $('#paso_'+npaso);
				// if(typeof itc.cantidad_x_paso[npaso] == "undefined"){
				// 	itc.cantidad_x_paso[npaso]=0;
				// }else{
				// 	// itc.cantidad_x_paso[npaso]++;
				// }
				// var cntbon = cntbontemp = parseInt($('#paso_'+npaso).data('cntbon'));
				// var cntbonsob = cntbonsobtemp = parseInt($('#paso_'+npaso).data('cntbonsob'));
				// cntbonmul = cntbon * (itc.click_cat_order.length / cntbonsob);

				// if(typeof itc.cantidad_x_paso_sob[paso] == "undefined"){
				// 	itc.cantidad_x_paso_sob[paso] = {'cntbontemp':cntbon,'cntbonsobtemp':cntbonsob};
				// }
				// if (cntbon > 0 && cntbonsob > 0) {
				// 	itc.cantidad_x_paso_sob[npaso].cntbonsobtemp--;
				// 	if(itc.cantidad_x_paso_sob[npaso].cntbonsobtemp == 0){
				// 		itc.cantidad_x_paso_sob[npaso] = {'cntbontemp':cntbon,'cntbonsobtemp':cntbonsob};
				// 	}
				// }
			}
		});

		//busca descuento por campo... revisar. cuando carga codigo de descuento por input de CD pone a cero si estan ambos habilitados
		var descuento_campo = false;
		/*
		$('*[data-descuento]:unchecked').each(function(){
			itc.porcentajedescuento = 0;
			$('.porcen_descuento').html(parseFloat(0).formatMoney(2, ',', '.'));
			$('#descuento_campo_importe').val(0);
			$('#descuento_campo').val(0);

		});
		$('*[data-descuento]:checked').each(function(){
			descuento = $(this).data('descuento');
			itc.porcentajedescuento = descuento;
			$('.porcen_descuento').html(parseFloat(descuento).formatMoney(2, ',', '.'));
			$('#descuento_campo_importe').val(descuento);
			var campo = $(this).data('idcampo');
			$('#descuento_campo').val(campo);
		});
		/**/
		subTotal = parseFloat(subTotal).formatMoney(2, ',', '.');
		$('.cate_subtotal').html(subTotal);
		//calcula recargo y suma al total antes de alicar el descuento... el descuento va sobre el total
		// var recargo = itc.recargo * Total / 100;
		// Total = Total + recargo;
		$('.precio_recargo').html(parseFloat(recargo_total).formatMoney(2, ',', '.'));
		if (itc.porcentajedescuento > 0 && !descuentoporcategoria && itc.categoriasdescuento.length <= 0 && !itc.useasprice) {
			// descuento = itc.porcentajedescuento * Total / 100;
			$('.form_descuento').html("-" + parseFloat(descuento).formatMoney(2, ',', '.'));
		} else if (descuentoporcategoria && !itc.useasprice) {
			$('.form_descuento').html("-" + parseFloat(descuento).formatMoney(2, ',', '.'));
		} else if (descuentoporcategoria && itc.useasprice && itc.categoriasdescuento.length > 0) {
			// descuento = itc.porcentajedescuento;
			$('.form_descuento').html("-" + parseFloat(descuento).formatMoney(2, ',', '.'));
			// $('.porcen_descuento').parent().hide();
		} else if (itc.useasprice && itc.porcentajedescuento > 0 && itc.categoriasdescuento.length <= 0) {
			// descuento = itc.porcentajedescuento;
			$('.form_descuento').html("-" + parseFloat(descuento).formatMoney(2, ',', '.'));
			// $('.porcen_descuento').parent().hide();
		} else if (descuento_campo) {
			$('.form_descuento').html("-" + parseFloat(descuento).formatMoney(2, ',', '.'));
		} else {
			$('.form_descuento').html("0,00");
		}
		Total = Total - descuento;
		if (Total < 0) {
			Total = 0;
		}
		itc.Total = parseFloat(Total);
		Total = parseFloat(Total).formatMoney(2, ',', '.');
		$('.cate_total').html(Total);
		texto_monto = $('.simbMon').html() + Total;
		$('#mostrar_monto').val(texto_monto);
		validarDatosFt(Total);

		if (itc.click_cat_order.length == 1 && tienebonificacantidad == true && itc.alertanotifiacion == false) {
			itc._alertbox("Te informamos que al comprar un curso tenÃ©s el segundo sin cargo y a elecciÃ³n. Sujeto a disponibilidad.");
			itc.alertanotifiacion = true;
		}

		return Total;
	},

	/*
	* Calcula total
	*/
	calculeTotal_Deprecated: function () {
		var Total = 0;
		var subTotal = 0;
		var descuento = 0;
		var descuentoporcategoria = false;
		var recargo = 0;
		var recargo_total = 0;
		itc.cantidad_x_paso = {};
		itc.cantidad_x_paso_sob = {};
		$('.porcen_descuento').parent().show();
		$('.cate_part:checked').each(function () {
			// $.each(itc.click_cat_order,function(k,v){
			debugger
			var cantidad = 1;
			var datoscat = v.split("_"); //0 paso,1 moneda, 2 categoria
			let element = $('#categoria_' + datoscat[1] + '_' + datoscat[2]);
			var pagada = parseInt($(this).data('catpaga'));
			if (pagada == 0) {
				// debugger
				var catid = String($(this).data('catid'));
				var idmon = parseInt($(this).data('idmon'));
				var npaso = String($(this).data('paso'));
				var paso = parseInt($(this).data('paso'));
				var precio = parseFloat($(this).data('precio'));
				let pasoparent = $('#paso_' + npaso);
				if (typeof itc.cantidad_x_paso[npaso] == "undefined") {
					itc.cantidad_x_paso[npaso] = 1;
				} else {
					itc.cantidad_x_paso[npaso]++;
				}
				var cntbon = cntbontemp = parseInt($('#paso_' + npaso).data('cntbon'));
				var cntbonsob = cntbonsobtemp = parseInt($('#paso_' + npaso).data('cntbonsob'));
				cntbonmul = cntbon * ($('.cate_part:checked', pasoparent).length / cntbonsob);

				if (typeof itc.cantidad_x_paso_sob[paso] == "undefined") {
					itc.cantidad_x_paso_sob[paso] = { 'cntbontemp': cntbon, 'cntbonsobtemp': cntbonsob };
				}

				console.log(itc.cantidad_x_paso_sob)

				if (cntbon > 0 && itc.cantidad_x_paso[npaso] <= cntbon && (cntbonsob <= 0)) {
					$('#contcate_' + idmon + '_' + catid + ' .card-title').html('<small>' + itc.monedas_formulario[idmon].signo + '</small> ' + parseFloat(0).formatMoney(2, ',', '.'));
					return;
				} else if (cntbon > 0 && cntbonsob > 0
					&& typeof itc.paso_categorias_bon[idmon] != 'undefined'
					&& typeof itc.paso_categorias_bon[idmon][catid] != 'undefined'
				) {
					$('#contcate_' + idmon + '_' + catid + ' .card-title').html('<small>' + itc.monedas_formulario[idmon].signo + '</small> ' + parseFloat(0).formatMoney(2, ',', '.'));
					itc.cantidad_x_paso_sob[npaso].cntbonsobtemp--;
					if (itc.cantidad_x_paso_sob[npaso].cntbonsobtemp == 0) {
						itc.cantidad_x_paso_sob[npaso] = { 'cntbontemp': cntbon, 'cntbonsobtemp': cntbonsob };
					}
					return;
				} else if (cntbon > 0 && cntbonsob > 0
					&& itc.cantidad_x_paso_sob[npaso].cntbonsobtemp <= itc.cantidad_x_paso_sob[npaso].cntbontemp) {
					$('#contcate_' + idmon + '_' + catid + ' .card-title').html('<small>' + itc.monedas_formulario[idmon].signo + '</small> ' + parseFloat(0).formatMoney(2, ',', '.'));
					itc.paso_categorias_bon[idmon] = {};
					itc.paso_categorias_bon[idmon][catid] = true;
					itc.cantidad_x_paso_sob[npaso].cntbonsobtemp--;
					if (itc.cantidad_x_paso_sob[npaso].cntbonsobtemp == 0) {
						itc.cantidad_x_paso_sob[npaso] = { 'cntbontemp': cntbon, 'cntbonsobtemp': cntbonsob };
					}
					return;
				}
				// }else if(cntbon > 0 && cntbonsob > 0
				// 	&& itc.cantidad_x_paso[npaso] <= cntbonmul
				// 	&& ($('.cate_part:checked',pasoparent).length % cntbonsob) === 0){
				// 	itc.cantidad_x_paso_sob[npaso]++;
				// 	$('#contcate_'+idmon+'_'+catid+' .card-title').html('<small>'+itc.monedas_formulario[idmon].signo+'</small> '+parseFloat(0).formatMoney(2, ',', '.'));
				// 	if(itc.cantidad_x_paso_sob[npaso] == cntbon){
				// 		itc.cantidad_x_paso_sob[npaso] = 1;
				// 	}
				// 	return;
				// }
				// else if(cntbon > 0 && cntbonsob > 0
				// 	&& itc.cantidad_x_paso[npaso] <= cntbonmul
				// 	&& $('.cate_part:checked',pasoparent).length >= cntbonsob
				// 	&& ($('.cate_part:checked',pasoparent).length % cntbonsob) !== 0){
				// 	itc.cantidad_x_paso_sob[npaso]++;
				// 	$('#contcate_'+idmon+'_'+catid+' .card-title').html('<small>'+itc.monedas_formulario[idmon].signo+'</small> '+parseFloat(0).formatMoney(2, ',', '.'));
				// 	if(itc.cantidad_x_paso_sob[npaso] == cntbon){
				// 		itc.cantidad_x_paso_sob[npaso] = 1;
				// 	}
				// 	return;
				// }
				else if (precio < 0) {
					var cardtit = $('#contcate_' + idmon + '_' + catid + ' .card-title').data('cardtit');
					$('#contcate_' + idmon + '_' + catid + ' .card-title').html(cardtit);
				} else {
					$('#contcate_' + idmon + '_' + catid + ' .card-title').html('<small>' + itc.monedas_formulario[idmon].signo + '</small> ' + parseFloat(precio).formatMoney(2, ',', '.'));
				}
				if ($('#cantidad_categorias_' + idmon + '_' + catid).val() > 1) {
					cantidad = $('#cantidad_categorias_' + idmon + '_' + catid).val();
				} else if ($('#cantidad_categorias_' + idmon + '_' + catid).data('cantidadselected') > 1) {
					cantidad = $('#cantidad_categorias_' + idmon + '_' + catid).data('cantidadselected');
				}

				if (cntbon > 0 && cntbonsob > 0) {
					itc.cantidad_x_paso_sob[npaso].cntbonsobtemp--;
					if (itc.cantidad_x_paso_sob[npaso].cntbonsobtemp == 0) {
						itc.cantidad_x_paso_sob[npaso] = { 'cntbontemp': cntbon, 'cntbonsobtemp': cntbonsob };
					}
				}

				var preciocantidad = 0;
				if ($(this).data('precio') > 0) {
					preciocantidad = (parseFloat($(this).data('precio')) * cantidad);
					subTotal = subTotal + preciocantidad;
					if (itc.recargo) {
						recargo = itc.recargo * preciocantidad / 100;
						recargo_total = recargo_total + recargo;
						preciocantidad = preciocantidad + recargo;
					}
					Total = Total + preciocantidad;
				}
				$.each(itc.codigodescuento.data, function (k, cd) {

					let porcentaje = parseFloat(cd.porcentaje);
					let categoriasdescuento = cd.categorias;
					let useasprice = cd.useasprice;

					if ($.inArray(catid, categoriasdescuento) >= 0 && porcentaje > 0 && $(this).data('precio') >= 0 && useasprice == 0
						&& (cd.id_moneda > 0 && cd.id_moneda == idmon)) {
						descuentoporcategoria = true;
						descuento = descuento + (porcentaje * preciocantidad / 100);
					} else if ($.inArray(catid, categoriasdescuento) >= 0 && porcentaje > 0 && $(this).data('precio') >= 0 && useasprice == 0) {
						//Si es porcentaje no debe revisar moneda
						descuentoporcategoria = true;
						descuento = descuento + (porcentaje * preciocantidad / 100);
					} else if ($.inArray(catid, categoriasdescuento) >= 0 && porcentaje > 0 && $(this).data('precio') >= 0 && useasprice == 1
						&& descuento < porcentaje && (cd.id_moneda > 0 && cd.id_moneda == idmon)) {
						descuentoporcategoria = true;
						// descuento = descuento + (itc.porcentajedescuento - parseFloat($(this).data('precio')));
						descuento = descuento + porcentaje;
					}
				});
				//codigo antes de becas multiples
				// Calcula descuento por categoria
				// if($.inArray( catid, itc.categoriasdescuento ) >= 0 && itc.porcentajedescuento > 0 && $(this).data('precio') >= 0 && itc.useasprice == 0
				// 	&& (itc.codigodescuento.data.id_moneda > 0 && itc.codigodescuento.data.id_moneda == idmon)){
				// 	descuentoporcategoria = true;
				// 	descuento = descuento + (itc.porcentajedescuento * preciocantidad / 100);
				// }else if($.inArray( catid, itc.categoriasdescuento ) >= 0 && itc.porcentajedescuento > 0 && $(this).data('precio') >= 0 && itc.useasprice == 0){
				// 	//Si es porcentaje no debe revisar moneda
				// 	descuentoporcategoria = true;
				// 	descuento = descuento + (itc.porcentajedescuento * preciocantidad / 100);
				// }else if($.inArray( catid, itc.categoriasdescuento ) >= 0 && itc.porcentajedescuento > 0 && $(this).data('precio') >= 0 && itc.useasprice == 1
				// 			&& descuento < itc.porcentajedescuento && (itc.codigodescuento.data.id_moneda > 0 && itc.codigodescuento.data.id_moneda == idmon)){
				// 	descuentoporcategoria = true;
				// 	// descuento = descuento + (itc.porcentajedescuento - parseFloat($(this).data('precio')));
				// 	descuento = descuento + itc.porcentajedescuento;
				// }
			}
		});

		//busca descuento por campo... revisar. cuando carga codigo de descuento por input de CD pone a cero si estan ambos habilitados
		var descuento_campo = false;
		/*
		$('*[data-descuento]:unchecked').each(function(){
			itc.porcentajedescuento = 0;
			$('.porcen_descuento').html(parseFloat(0).formatMoney(2, ',', '.'));
			$('#descuento_campo_importe').val(0);
			$('#descuento_campo').val(0);

		});
		$('*[data-descuento]:checked').each(function(){
			descuento = $(this).data('descuento');
			itc.porcentajedescuento = descuento;
			$('.porcen_descuento').html(parseFloat(descuento).formatMoney(2, ',', '.'));
			$('#descuento_campo_importe').val(descuento);
			var campo = $(this).data('idcampo');
			$('#descuento_campo').val(campo);
		});
		/**/
		subTotal = parseFloat(subTotal).formatMoney(2, ',', '.');
		$('.cate_subtotal').html(subTotal);
		//calcula recargo y suma al total antes de alicar el descuento... el descuento va sobre el total
		// var recargo = itc.recargo * Total / 100;
		// Total = Total + recargo;
		$('.precio_recargo').html(parseFloat(recargo_total).formatMoney(2, ',', '.'));
		if (itc.porcentajedescuento > 0 && !descuentoporcategoria && itc.categoriasdescuento.length <= 0 && !itc.useasprice) {
			descuento = itc.porcentajedescuento * Total / 100;
			$('.form_descuento').html("-" + parseFloat(descuento).formatMoney(2, ',', '.'));
		} else if (descuentoporcategoria && !itc.useasprice) {
			$('.form_descuento').html("-" + parseFloat(descuento).formatMoney(2, ',', '.'));
		} else if (descuentoporcategoria && itc.useasprice && itc.categoriasdescuento.length > 0) {
			// descuento = itc.porcentajedescuento;
			$('.form_descuento').html("-" + parseFloat(descuento).formatMoney(2, ',', '.'));
			// $('.porcen_descuento').parent().hide();
		} else if (itc.useasprice && itc.porcentajedescuento > 0 && itc.categoriasdescuento.length <= 0) {
			// descuento = itc.porcentajedescuento;
			$('.form_descuento').html("-" + parseFloat(descuento).formatMoney(2, ',', '.'));
			// $('.porcen_descuento').parent().hide();
		} else if (descuento_campo) {
			$('.form_descuento').html("-" + parseFloat(descuento).formatMoney(2, ',', '.'));
		} else {
			$('.form_descuento').html("0,00");
		}
		Total = Total - descuento;
		itc.Total = parseFloat(Total);
		Total = parseFloat(Total).formatMoney(2, ',', '.');
		$('.cate_total').html(Total);
		texto_monto = $('.simbMon').html() + Total;
		$('#mostrar_monto').val(texto_monto);
		validarDatosFt(Total);
		return Total;
	},
	/*
	* @deprecated
	* Calcula recargo por uso de metodo de pago
	*/
	calculeRecargo: function (id_metodo_pago) {
		return false;
		this.clearCategorias();
		if (id_metodo_pago <= 0) {
			if (!$('input[name="pago"]').is(':checked'))
				return false;
			id_metodo_pago = $('input[name="pago"]').val()
		}
		var recargo = parseFloat($('#recargo_categoria_' + id_metodo_pago).val());
		if (recargo > 0) {
			var html_mediopago_int = "";
			var precio = 0;
			var cat_sel;
			$('.cat_hab').each(function () {
				var splitValue = this.value.split("_");
				if ($(this).prop('checked')) {
					cat_sel = itc.categorias[parseInt(splitValue[3])][parseInt(splitValue[2])];
					precio += parseFloat(cat_sel.precio);
					var calculo_recargo_indv = recargo * parseFloat(cat_sel.precio) / 100;
					calculo_recargo_indv += parseFloat(cat_sel.precio);
					$("#cat-prec-" + splitValue[3] + "_" + splitValue[2]).css('text-decoration', ' line-through');
					html = "<span class='text-success helper-font-small'>" + recargo + " " + this._t('porcentaje_recargo') + "</span><br>";
					html += "<strong>" + this._t('TOTAL') + ": " + cat_sel.signo + " " + parseFloat(calculo_recargo_indv).formatMoney(2, ',', '.') + " " + cat_sel.moneda + "</strong>";
					$("#cat-desc-" + splitValue[3] + "_" + splitValue[2]).html(html).show();
					html_mediopago_int += "<tr><td align='center' colspan='2'>" + this._t('CATEGORIA') + ": " + cat_sel.categoria + "</td></tr>";
					html_mediopago_int += "<tr><td>" + this._t('PRECIO') + "</td><td style='text-align: right;'>" + cat_sel.signo + " " + parseFloat(cat_sel.precio).formatMoney(2, ',', '.') + " " + cat_sel.moneda + "</td></tr>";
				}
			});
			var calculo_recargo = recargo * precio / 100;
			precio = precio + calculo_recargo;

			html_mediopago = "<table style=''>";
			html_mediopago += html_mediopago_int;
			html_mediopago += "<tr style='border-top: 1px solid #ccc;'><td>" + this._t('RECARGO') + " " + recargo + " %:</strong></td><td style='text-align: right;'>" + cat_sel.signo + " " + parseFloat(calculo_recargo).formatMoney(2, ',', '.') + " " + cat_sel.moneda + "</td></tr>";
			html_mediopago += "<tr><td>Total:</td><td style='text-align: right;'>" + cat_sel.signo + " " + parseFloat(precio).formatMoney(2, ',', '.') + " " + cat_sel.moneda + "</td></tr>";
			html_mediopago += "</table>";

			$("#met-desc-" + id_metodo_pago).html(html_mediopago).show();
		} else {
			$(".recargo_metodo_pago").html("").hide();
		}
	},

	/*
	*
	*/
	getCantidadCategorias: function () {
		var cantidad = 0;
		$('.cate_part:checked').each(function () {
			// var catid = $(this).attr('id').split("_");
			var catid = $(this).data('catid');
			var idmon = $(this).data('idmon');
			if (typeof $('#cantidad_categorias_' + idmon + '_' + catid).val() != "undefined") {
				cantidad = cantidad + parseInt($('#cantidad_categorias_' + idmon + '_' + catid).val());
			} else {
				cantidad = cantidad + 1;
			}
		});
		// console.log(cantidad);
		return cantidad;
	},

	/*
	*
	*/
	clearCategorias: function () {
		var self = this;
		$('.cate_part:checked').each(function () {
			var aleatorio = $('[name="invitacion"]').val();
			if (aleatorio != '' && aleatorio != undefined && itc.onReady) {
				return;
			}
			var catid = $(this).data('catid');
			var idmon = $(this).data('idmon');
			$('#btncat_' + idmon + '_' + catid).click();
			self.validarDependenciaCategoriaGrupo(false, catid);
		});
		//solo saltea este paso si es invitacion y si accede a la carga durante el evento onready
		itc.onReady = false;
		/* //old code
		$('.cat_hab').each(function(){
			var splitValue = this.value.split("_");
			$("#cat-prec-"+splitValue[3]+"_"+splitValue[2]).css('text-decoration','');
			$("#cat-desc-"+splitValue[3]+"_"+splitValue[2]).html("").hide();
		});
		/**/
	},

	/*
	*
	*/
	fijar_requerido_beca: function (id, id_precio, estado, valor, tipocat, element) {
		this.id_categoria_seleccionada = id;
		this.id_precio_seleccionada = id_precio;
		if (tipocat == 'incluyente') {

			if (estado) {
				if (valor <= 0) {
					if ($(element).prop('checked')) {
						this.gvalidar_beca = true;
						$('#beca_' + id + '_' + id_precio).rules("add", { required: true });
						$('#beca_' + id + '_' + id_precio).fadeIn(200);
						$('label[for*="beca_' + id + '_' + id_precio + '"]').fadeIn(200);
					} else {
						$('#beca_' + id + '_' + id_precio).rules("remove");
						$('#beca_' + id + '_' + id_precio).val("").fadeOut(200);
						$('label[for*="beca_' + id + '_' + id_precio + '"]').html('').fadeOut(200);
						$('#iconobeca_' + id + '_' + id_precio).fadeOut(200);
						$('#iconobeca_wrong_' + id + '_' + id_precio).fadeOut(200);
					}
				}
			} else {
				this.gvalidar_beca = false;
			}


		} else {
			$('input[id*="beca_"]').val("").css('display', 'none');
			$('label[for*="beca_"]').html('').css('display', 'none');
			$('[id*="cat-desc-"]').html("").fadeOut(200);
			$('[id*="cat-prec-"]').css('text-decoration', ' none');
			$('[id*="iconobeca_"]').fadeOut(200);
			$('[id*="iconobeca_wrong_"]').fadeOut(200);
			if (estado) {
				if (valor <= 0) {
					$('input[id*="beca_"]').each(function () { $(this).rules("add", { required: false }) });
					$('#beca_' + id + '_' + id_precio).rules("add", { required: true });
				}
				if ($('#beca_' + id + '_' + id_precio).length) {
					$('#beca_' + id + '_' + id_precio).css('display', 'inline');
					this.gvalidar_beca = true;
				}
			} else {
				this.gvalidar_beca = false;
			}
		}
		itc.calculeRecargo(0);
	},

	/*
	* @Deprecated?
	*/
	ver_tooltip: function (id, accion) {
		var obj = $('#span_' + id);
		if (accion == 'mostrar') {
			$(obj).tooltip('show');
		} else {
			$(obj).attr('data-html', 'true');
			$(obj).attr('data-toggle', 'tooltip');
			$(obj).attr('data-placement', 'right');
			var titulo = $('#select_' + id + ' option:selected').attr('alt');
			$(obj).attr('data-original-title', titulo);
			$(obj).tooltip();
			$(obj).tooltip('show');
		}
	},

	seleccionarCantidad: function (idCategoria, nameCat) {
		var idCat = "categoria-" + idCategoria;
		var check = document.getElementById(idCat);

		var categoria = document.getElementById("cantidad_categorias_" + idCategoria);
		if (categoria) {
			var splitValue = check.value.split("_");



			if (splitValue[0] < 0) {

				for (i = 0; i < document.getElementById("cantcheck").value; i++) {
					//document.getElementById("pago"+i).checked = false;
					if (document.getElementById("pago" + i).value == 10) {
						document.getElementById("pago" + i).disabled = false;
						//document.getElementById("pago"+i).checked = false;
					}
					if (document.getElementById("pago" + i).value != 10) {
						document.getElementById("pago" + i).disabled = true;
					}
				}
			} else {

				for (i = 0; i < document.getElementById("cantcheck").value; i++) {
					//document.getElementById("pago"+i).checked = false;
					if (document.getElementById("pago" + i).value == 10) {
						document.getElementById("pago" + i).disabled = true;
					}

					if (document.getElementById("pago" + i).value != 10) {
						document.getElementById("pago" + i).disabled = false;
					}
				}
			}




			if (check.checked && categoria) {
				categoria.disabled = false;
				categoria.style.opacity = 1;

			} else if (categoria) {
				categoria.disabled = true;
				categoria.style.opacity = 0.4;
			}


			if (typeof nameCat != "undefined") {
				var cate = document.getElementsByName("categoria[" + nameCat + "]");
				for (i = 0; i < cate.length; i++) {
					var estadoCategoria = document.getElementById(cate[i].id);
					var c = document.getElementById("cantidad_categorias_" + (cate[i].id).substr(10));
					//alert("cantidad_categorias_" + (cate[i].id).substr(10) + " - Estado: " + estadoCategoria.checked);
					if (c && estadoCategoria.checked == false) {
						c.disabled = true;
						c.style.opacity = 0.4;
					}
					else if (c) {
						c.disabled = false;
						c.style.opacity = 1;
					}

				}
			}
		}


	},

	/*
	*
	*/
	validarDependencia: function (val) {
		var grupo = this.dependencias_grupos[val];
		$("[id^=paso_]").removeClass('hide');
		$('input,select,textarea').prop('disabled', false);
		if (grupo != undefined) {
			$.each(grupo, function (k, v) {
				var grp = v.id_grupos.split(',');
				$.each(grp, function (k, v) {
					$('.grp' + v).addClass('hide');
					$('.grp' + v + ' input,.grp' + v + ' select,.grp' + v + ' textarea').prop('disabled', true);
					$('.grp' + v + ' .cate_part:checked').each(function () {
						var catid = $(this).data('catid');
						var idmon = $(this).data('idmon');
						$('#btncat_' + idmon + '_' + catid).click();
					});
				});
			});
		}
	},
	/*
	*
	*/
	validarDependenciaCategoriaGrupo: function (checked, id_categoria) {
		var self = this;
		var categorias = self.grupos_dep_categorias[id_categoria];
		if (categorias != undefined) {
			var grp = categorias.split(',');
			$.each(grp, function (k, v) {
				if (checked) {
					$('.grp' + v).removeClass('hide');
					$('.grp' + v + ' input,.grp' + v + ' select,.grp' + v + ' textarea').prop('disabled', false);
				} else {
					$('.grp' + v).addClass('hide');
					$('.grp' + v + ' input,.grp' + v + ' select,.grp' + v + ' textarea').prop('disabled', true);
				}
			});
		}
	},
	/*
	*
	*/
	validarCampoLista: function (id) {
		var optionSeleccionado = $('select[name^="campo[' + id + ']"] option:selected').val();
		var arrayHasOtro = false;
		var optionSeleccionadoArray = $('select[name^="campo[' + id + ']"] option:selected').map(function (i, el) {
			var val = $(el).val().replace(/\s/g, '').toLowerCase();
			if (val === "Otras" || val === "otras" || val === "Otros" || val === "otros"
				|| val === "Otro" || val === "otro" || val === "Otra" || val === "otra"
				|| val === "OTRA" || val === "OTRAS" || val === "OTRO" || val === "other") {
				arrayHasOtro = true;
			}
		}).get();
		if (optionSeleccionado === "{%DNI%}" || optionSeleccionado === "{%RUT%}" ||
			optionSeleccionado === "{%LE%}" || optionSeleccionado === "{%LC%}" || optionSeleccionado === "{%PAS%}") {
			var optionSeleccionadoTexto = $('select[name^="campo[' + id + ']"] option:selected').text();
			// $("#inputPrepand_" + (id + 1)).attr("placeholder", "Ingrese " + optionSeleccionadoTexto);
			$("#inputPrepand_" + (id + 1)).attr("alt", optionSeleccionado);
			$("#inputPrepand_" + (id + 1)).rules("remove");
			// Agrego las validaciones para que busque si ya existe el valor en el tipo seleccionado (el nÃºmero de dni por ejemplo)
			switch (optionSeleccionado) {
				case "{%DNI%}":
					// console.log("#inputPrepand_" +(id + 1));
					$("#inputPrepand_" + (id + 1)).rules("remove");
					$("#inputPrepand_" + (id + 1)).rules("add", {
						dni: true
					});
					if (itc.validarDNI == 'true') {
						$("#inputPrepand_" + (id + 1)).rules("add", {
							verificacionDNI: true
						});
					}
					break;
				case "{%RUT%}":
					$("#inputPrepand_" + (id + 1)).rules("remove");
					$("#inputPrepand_" + (id + 1)).rules("add", {
						rut: true
					});
					if (itc.validarDNI == 'true') {
						$("#inputPrepand_" + (id + 1)).rules("add", {
							verificacionDNI: true
						});
					}
					break;

				case "{%PAS%}":
					$("#inputPrepand_" + (id + 1)).rules("remove");
					if (itc.validarDNI == 'true') {
						$("#inputPrepand_" + (id + 1)).rules("add", {
							verificacionDNI: true
						});
					}
					break;
				case "{%LC%}":
					$("#inputPrepand_" + (id + 1)).rules("remove");
					$("#inputPrepand_" + (id + 1)).rules("add", {
						rut: true
					});
				default:
					$("#inputPrepand_" + (id + 1)).rules("remove");
					break;
			}
		}
		else {
			if (typeof optionSeleccionado != 'undefined')
				optionSeleccionado = optionSeleccionado.replace(/\s/g, '').toLowerCase();
			if (optionSeleccionado === "Otras" || optionSeleccionado === "otras" || optionSeleccionado === "Otros" || optionSeleccionado === "otros"
				|| optionSeleccionado === "Otro" || optionSeleccionado === "otro" || optionSeleccionado === "Otra" || optionSeleccionado === "otra"
				|| optionSeleccionado === "OTRA" || optionSeleccionado === "OTRAS" || optionSeleccionado === "OTRO" || optionSeleccionado === "other"
				|| arrayHasOtro) {
				// var nameSelect = $('select[name="campo['+ id +']"] option:selected').attr("name");
				var nameSelect = $('select[name^="campo[' + id + ']"]').attr("name");
				// Generar un nuevo input text y asignarle el name del select list
				$('select[name^="campo[' + id + ']"] option:selected').attr("name", ""); // Quito el name al select list para ponerselo al input text
				$("#generar_campo_otros_" + id).css("margin-top", "4px");
				$("#generar_campo_otros_" + id).html("<input type='text' class='form-control' id='campo_otros_" + id + "' placeholder='" + itc._t('indique') + "' name='" + nameSelect + "' />");
			} else {
				// Quito el input text y restauro el name al select list
				$("#generar_campo_otros_" + id).css("margin-top", "0px");
				$("#generar_campo_otros_" + id).html("");
			}
		}
	},

	recuperarDatos: function () {
		var self = this;
		var email = $("#verificaEmail").val();
		if (email == '' || typeof email == 'undefined') {
			var email = $("#editarInscripcion").find("#usuario").val();
		}
		if (email == '') {
			itc._alertbox("Debe ingresar su email!");
			return false;
		}
		itc._alertbox('Aguarde un momento...');
		$.ajax({
			url: itc.siteurl + "rest/v1/recuperarEmail",
			type: "post",
			data: { id_formulario: self.id_formulario, _token: itc._token, email: email },
			dataType: "JSON",
			success: function (response) {
				itc._alertbox(response.msg);
			}
		});
	},

	buscarDatosLista: function (comodin, idSelect, el) {
		switch (comodin) {
			case "{%PAISES%}": // Traigo lista de provincias relacionadas con el pais en cuestiÃ³n
				var valorPais = $(el).val();
				if (valorPais == '')
					return false;
				itc.setMonedaPais(valorPais);
				var seleccion = $("#select_" + idSelect);
				var selected = seleccion.data('selected');
				var idcampo = seleccion.data('idcampo');

				itc.setDatosFacturacion(valorPais);

				if (itc.id_formulario == 1611 && valorPais == 'Argentina') {
					itc.habilitarCategorias();
				}

				seleccion.html("Cargando ...");
				$("#cargando_select_" + idSelect).text("Cargando ...");
				$("#cargando_select_" + idSelect).show();
				$.ajax({
					url: itc.siteurl + "rest/v1/devolverprovincias",
					type: "post",
					data: { code: valorPais, _token: itc._token, idcampo: idcampo, selected: selected },
					dataType: "JSON",
					success: function (e) {
						// seleccion.append(e.data).select2();
						if (selected == 'sin_estilos') {
							var html = '';
							$.each(e.data, function (k, v) {
								html += '<option value="' + v.id + '">' + v.text + "</option>";
							});
							$("#select_" + idSelect).html(html);
						} else {
							$("#select_" + idSelect).select2({ data: e.data });
						}
						$("#cargando_select_" + idSelect).text("Â¡Listo!");
						$("#cargando_select_" + idSelect).fadeOut(500, "", function () {
							$("#cargando_select_" + idSelect).text("Cargando ..."); // Dejo el mensaje como al inicio.
						});
						$('#select_' + idSelect + ' option:first').attr('value', '');
					}
				});
				break;
		}
	},

	LLenarDatosListaAsociada: function (idCampo, idpariente) {
		var datos = this.arregloListaAsociada;
		if (idpariente == '1') {
			idhijo = Number(idCampo) + 1;
			var lsthija = $('[name="campo[' + idhijo + ']"]');
			var valsel = lsthija.data('selected');
			// var lsthija = $("#inputSelectAsociada_" + idhijo);
			lsthija.html("");
			lsthija.select2("val", null);
			//$("#cargando_select_" + idCampo).show();
			// var valorsel = $("#inputSelectAsociada_" + idCampo + " option:selected").text();
			var valorsel = $('[name="campo[' + idCampo + ']"] option:selected').text();
			p = valorsel.indexOf(" ");
			clave = valorsel.substring(0, p);
			h = "inputSelectAsociada_" + idhijo;
			var s = "";
			for (i = 0; i < datos.length; i++) {
				if (idhijo == datos[i][0] && clave == datos[i][1]) {
					s += "<option>" + datos[i][2] + "</option>";
					// document.getElementById('inputSelectAsociada_' + idhijo).innerHTML += s;
				}
			}
			$('[name="campo[' + idhijo + ']"]').html(s);
			if (valsel != '')
				$('[name="campo[' + idhijo + ']"]').val(valsel).trigger("change");
		}
	},
	/*
	* @Deprecated?
	*/
	mostrar_input_beca: function (id, c, e) {
		if (e !== undefined) { //parametro opcional que fuera el estado
			if (e) {
				$('#' + id).prop('disabled', false);
				$('#' + id).fadeIn(500);
				$('#lnkbeca_' + c).text("cancelar cÃ³digo.")
			} else {
				$('#' + id).prop('disabled', true);
				$('#' + id).fadeOut(500);
				$('#iconobeca_' + c).fadeOut(200);
				$('#iconobeca_wrong_' + c).fadeOut(200);
				$('#' + id).val('');
				$('#lnkbeca_' + c).text("Â¿Posee cÃ³digo de descuento?")
				var s = 'beca_' + c;
				$("label[for='" + s + "']").html('');
				$("label[for='" + s + "']").css('display', 'none');
			}
		} else {
			if (document.getElementById(id).style.display == 'none') {
				$('#' + id).focus();
				$('#' + id).prop('disabled', false);
				$('#' + id).fadeIn(500);
				$('#lnkbeca_' + c).text("cancelar cÃ³digo.")
			} else {
				$('#' + id).prop('disabled', true);
				$('#' + id).fadeOut(500);
				$('#iconobeca_' + c).fadeOut(200);
				$('#iconobeca_wrong_' + c).fadeOut(200);
				$('#' + id).val('');
				$('#lnkbeca_' + c).text("Â¿Posee cÃ³digo de descuento?")
				var s = 'beca_' + c;
				$("label[for='" + s + "']").html('');
				$("label[for='" + s + "']").css('display', 'none');
			}
		}
	},

	validarCuit: function (cuit) {

		if (cuit.length != 11) {
			return false;
		}

		var acumulado = 0;
		var digitos = cuit.split("");
		var digito = digitos.pop();

		for (var i = 0; i < digitos.length; i++) {
			acumulado += digitos[9 - i] * (2 + (i % 6));
		}

		var verif = 11 - (acumulado % 11);
		if (verif == 11) {
			verif = 0;
		} else if (verif == 10) {
			verif = 9;
		}

		return digito == verif;
	},

	validarCuil: function (cuil) {

		if (cuil.length != 11) {
			return false;
		}

		var acumulado = 0;
		var digitos = cuil.split("");
		var digito = digitos.pop();

		for (var i = 0; i < digitos.length; i++) {
			acumulado += digitos[9 - i] * (2 + (i % 6));
		}

		var verif = 11 - (acumulado % 11);
		if (verif == 11) {
			verif = 0;
		} else if (verif == 10) {
			verif = 9;
		}

		return digito == verif;
	},
	/**
	 * ValidaciÃ³n pedida por el BNA
	 * 'el CUIT debe comenzar por 2 o por 3'
	 * Funciona con el 'extras'  'bna'
	 */
	validarCuitBna: function (cuit) {
		if (cuit.startsWith("2") || cuit.startsWith("3")) {
			return true;
		}
		return false;
	},

	ocultarCargando: function (id) {
		//alert(id);
		$("#cargando" + id).css("display", "none");
	},

	/***************** Colaboradores ************************/
	// Guardar colaborador
	// guardarColaborador: function (nombre, apellido, email, puesto){
	// 	$.ajax({
	// 		url : "colaboradores.php",
	// 		type : "post",
	// 		data : {id_formulario : this.id_formulario,nombre : nombre, apellido : apellido, email : email, puesto : puesto, id_expositor:this.idColIns},
	// 		dataType: "JSON",
	// 		success : function(response){
	// 			return response;
	// 		}
	// 	});
	// },

	// Eliminar colaborador
	eliminarColaborador: function (idExpositor, idFormulario, idColaborador) {
		$.ajax({
			url: "eliminarColaborador.php",
			type: "post",
			data: { id_formulario: idFormulario, id_expositor: idExpositor, id_colaborador: idColaborador },
			dataType: "JSON",
			success: function (response) {
				if (response.error == 1) {
					alert(response.mensaje);
				}
			}
		});
		//return(datosT); // Objeto (datosT.error, datosT.mensaje, etc - ver archivo colaboradores.php-)
	},

	agregarCampo: function () {
		//idUsuario++; // Este dato debe ser dinÃ¡mico
		var nombre = $("#nombre").val();
		var apellido = $("#apellido").val();
		var email = $("#email").val();
		var puesto1 = $("#puesto").val();
		if (nombre != "" && apellido != "" && email != "" && puesto1 != "") {
			if (contadorGeneral >= limiteColaboradores) {
				// alert("Se ha alcanzado el lÃ­mite de colaboradores permitidos.");
				alert(this._t('limite_colaboradores'));
				return false;
			}

			var guardarC = this.guardarColaborador(nombre, apellido, email, puesto1);

			if (!guardarC.error) {
				contadorGeneral++;
				if (contadorGeneral > 0) {
					var aviso = document.getElementById("sin-datos-colaboradores");
					aviso.style.visibility = "collapse";
				}
				idUsuario = guardarC.idUsuario;
				var contenedor = document.getElementById("contenedor");
				var tr = document.createElement("tr");
				tr.id = "colaborador-" + idUsuario;
				var colaborador = document.createElement("td");
				colaborador.innerHTML = apellido + " " + nombre;
				var puesto = document.createElement("td");
				puesto.innerHTML = puesto1;
				var eliminar = document.createElement("td");
				var link = document.createElement("a");
				link.href = "javascript:itc.eliminarCampo(" + idUsuario + ");";
				link.innerHTML = "Quitar";
				eliminar.appendChild(link);

				var colCont = document.createElement("td");
				colCont.innerHTML = idUsuario; //contadorGeneral;

				tr.appendChild(colCont);
				tr.appendChild(colaborador);
				tr.appendChild(puesto);
				tr.appendChild(eliminar);
				contenedor.appendChild(tr);
			}
			else {
				alert(guardarC.mensaje);
			}

		}
		else {
			// alert("Faltan datos en los campos.");
			alert(this._t('faltan_datos'));
		}

	},

	eliminarCampo: function (idCampo) {
		if (!confirm(this._t('eliminar_colaborador'))) {
			return;
		}
		contadorGeneral--;
		if (contadorGeneral == 0) {
			var aviso = document.getElementById("sin-datos-colaboradores");
			aviso.style.visibility = "visible";
		}
		var contenedor = document.getElementById("colaborador-" + idCampo);
		var padre = contenedor.parentNode;
		padre.removeChild(contenedor);
		this.eliminarColaborador(this.invitacion, this.id_formulario, idCampo);
	},

	ocultarExaminar: function (id) { // id es el id del campo
		$("#examinar-disco" + id).css("visibility", "hidden");
		$("#buscar-archivo" + id).css("display", "none");
	},

	colocarImagen: function (img, id, tipo) { // tipo indica si es imagen o logo
		$("#imagen-cargada" + id).html("<div id='imagen_campo_" + id + "' class='img-form-editada'><a href='javascript:void(0);' onclick='quitarImg(\"" + img + "\", " + id + ");'><img src='uploads/F" + itc.id_formulario + "/editadas/" + img + "' class='borrar-img' style='width:250px;' /></a></div><input type='hidden' name='archivo_img[" + tipo + "]' value='" + img + "' />");
		$("#imagen-cargada" + id).css("display", "block");
	},

	quitarImg: function (img, id) {
		if (confirm("Â¿Realmente deseas quitar la imagen?")) {
			if (img !== "") {
				$.ajax({
					method: "post",
					type: "post",
					url: "quitarImg.php",
					data: { f: '<?php echo $idFormulario ?>', archivo: img },
					success: function (e) {
						if (e != 0) {
							//alert(e);
							$("#imagen-cargada" + id).fadeOut(500, function () {
								$("#examinar-disco" + id).css("visibility", "visible");
								$("#buscar-archivo" + id).css("display", "block");
							});
							//$("#imagen-cargada" + id).html("");
						}
						else {
							alert("No se pudo eliminar.");
						}
					}
				});
			}
		}
	},

	checkCodigoxCategoria: function () {

		$('[name="codigo_x_categoria"]').on('change keyup', function () {
			var catid = $(this).data('checkcate');
			var idmon = $(this).data('idmon');
			var value = $(this).val();
			const alert = $('#show-alert')
			let dataToSend = { code: value }

			$.ajax({
				url: 'http://localhost:3000/codes',
				type: 'POST',
				data: dataToSend,
				dataType: 'JSON',
				async: true,
				success: function (e) {
					console.log(e);
					$("[name=codigo_x_categoria]").parent().removeClass('has-success').addClass('has-error');
					$("div.codigoxcategoria").find('span.form-control-feedback').html('clear');
					$("div.codigoxcategoria").find('label').html(e).show();
					itc.codigoxcategoria.msg = e;
				}
			}, () => {
				console.log(value);
			});
		});
	},

	checkCodigoLG: function (idmon, catid) {


		$('#formCLG').validate({
			ignore: '',
			submitHandler: function (form) {

				var dni = $('[name="clublg_dni"]').val();
				var num_socio = $('[name="clublg_idsocio"]').val();

				$.ajax({
					url: itc.siteurl + "rest/v1/clublg",
					type: "post",
					data: { dni: dni, num_socio: num_socio, idf: itc.id_formulario, _token: itc._token },
					dataType: "JSON",
					async: false,
					success: function (e) {
						// console.log(e);
						if (e.success && e.response.estado == 1) {

							$('[name="codigo_categoria_clublg[' + catid + ']"]').val(num_socio);
							// $("[name=codigo_categoria_"+catid+"]").val(value);
							$("[name=clublg_idsocio]").parent().removeClass('has-error').addClass('has-success');
							$("div.codigoxcategoria").find('label').hide();
							$("div.codigoxcategoria").find('span.form-control-feedback').html('done');
							$("div.codigoxcategoria").find('label').html('');
							itc.enableCategoria(itc.btncatelement, catid, idmon);
							var precio = $("#categoria_" + idmon + "_" + catid).data('precio');
							$('#clg_msj').html(e.response.msj);
							$("#myAlertMessage .close").click();
						} else {
							$("[name=clublg_idsocio]").parent().removeClass('has-success').addClass('has-error');
							$("div.codigoxcategoria").find('span.form-control-feedback').html('clear');
							$("div.codigoxcategoria").find('label').html(e.response.msj);
							itc.codigoxcategoria.msg = e.response.msj;
							$('#clg_msj').html(e.response.msj);
							itc.disableCategoria(itc.btncatelement, catid, idmon);
						}
						itc.calculeTotal();
						return false;
					}
				});

				return false;
			}
		});

		$('[name="clublg_idsocio"]').on('keypress', function (evt) {
			evt = (evt) ? evt : window.event;
			var charCode = (evt.which) ? evt.which : evt.keyCode;
			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
				return false;
			}
			return true;
		});
		/*
		$('[name="clublg_idsocio"]').on('keyup',function(){
			var catid = $(this).data('checkcate');
			var idmon = $(this).data('idmon');
			var value = $(this).val();

			var dni = $('[name="clublg_dni"]').val();

			if(dni == '' || value == ''){
				return false;
			}

			// console.log(value);
			if(value.length == 0)
				return true;
			if(value.length < 8)
				return false;
			// if(value == itc.codigodescuento.code){
			// 	return itc.codigodescuento.state;
			// }
			// if(value == itc.codigoxcategoria.code){
			// 	return itc.codigoxcategoria.state;
			// }

			if (itc.codigoInvitado == null) idInscripcion = 0
			else idInscripcion = itc.id_inscripcion;

			$.ajax({
				url : itc.siteurl + "rest/v1/clublg",
				type : "post",
				data : {dni : dni, num_socio : value, idf : itc.id_formulario, _token:itc._token},
				dataType: "JSON",
				async: false,
				success : function(e){
					console.log(e);
					if(e.success && e.response.estado == 1){

						$('[name="codigo_categoria_clublg['+catid+']"]').val(value);
						// $("[name=codigo_categoria_"+catid+"]").val(value);
						$("[name=clublg_idsocio]").parent().removeClass('has-error').addClass('has-success');
						$("div.codigoxcategoria").find('label').hide();
						$("div.codigoxcategoria").find('span.form-control-feedback').html('done');
						$("div.codigoxcategoria").find('label').html('');
						itc.enableCategoria(itc.btncatelement,catid,idmon);
						var precio = $("#categoria_"+idmon+"_"+catid).data('precio');
						$('#clg_msj').html('');
						$("#myAlertMessage .close").click();
					}else{
						$("[name=clublg_idsocio]").parent().removeClass('has-success').addClass('has-error');
						$("div.codigoxcategoria").find('span.form-control-feedback').html('clear');
						$("div.codigoxcategoria").find('label').html(e.response.msj);
						itc.codigoxcategoria.msg = e.response.msj;
						$('#clg_msj').html(e.response.msj);
						itc.disableCategoria(itc.btncatelement,catid,idmon);
					}
					itc.calculeTotal();
				}
			});
		});
		*/
	},



	checkCodigoIDInscripto: function (idmon, catid) {


		$('#formIDINSCREL').validate({
			ignore: '',
			submitHandler: function (form) {

				var dni = $('[name="idinscr_dni"]').val();
				var num_inscr = $('[name="codigo_inscr"]').val();

				$.ajax({
					url: itc.siteurl + "rest/v1/checkidinscr",
					type: "post",
					data: { dni: dni, num_inscr: num_inscr, idf: itc.id_formulario, _token: itc._token },
					dataType: "JSON",
					async: false,
					success: function (e) {
						// console.log(e);
						if (e.success && e.response.id_inscripcion != '') {
							// $('[data-index="VALIDATOR"]').rules("add",{required:false,api:false});
							$('[name="id_inscripcion_rel[' + catid + ']"]').val(e.response.id_inscripcion);
							// $("[name=codigo_categoria_"+catid+"]").val(value);
							$("[name=codigo_inscr]").parent().removeClass('has-error').addClass('has-success');
							$("div.codigoxcategoria").find('label').hide();
							$("div.codigoxcategoria").find('span.form-control-feedback').html('done');
							$("div.codigoxcategoria").find('label').html('');
							itc.enableCategoria(itc.btncatelement, catid, idmon);
							var precio = $("#categoria_" + idmon + "_" + catid).data('precio');
							$('#clg_msj').html(e.response.campo1 + ' ' + e.response.campo2);
							$("#msjcat" + idmon + "_" + catid).remove();
							// debugger;
							$("#contcate_" + idmon + "_" + catid).append('<p id="msjcat' + idmon + '_' + catid + '">CategorÃ­a de InscripciÃ³n relacionada con el inscripto <b>' +
								e.response.campo1 + ' ' + e.response.campo2 + '</b></p>'
							);
							$("#myAlertMessage .close").click();
						} else {
							$("[name=codigo_inscr]").parent().removeClass('has-success').addClass('has-error');
							$("div.codigoxcategoria").find('span.form-control-feedback').html('clear');
							$("div.codigoxcategoria").find('label').html(e.response.msj);
							itc.codigoxcategoria.msg = e.response.msj;
							$('#clg_msj').html(e.response.msj);
							$("#msjcat" + idmon + "_" + catid).remove();
							itc.disableCategoria(itc.btncatelement, catid, idmon);
						}
						itc.calculeTotal();
						return false;
					}
				});

				return false;
			}
		});

		$('[name="codigo_inscr"]').on('keypress', function (evt) {
			evt = (evt) ? evt : window.event;
			var charCode = (evt.which) ? evt.which : evt.keyCode;
			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
				return false;
			}
			return true;
		});
	},

	setMonedaPais: function (pais) {
		var cargmon = false;
		var restmndo = 0;
		var restosigno = '';
		if (pais == '') {
			pais = $('*[data-comodin="{%PAISES%}"]').data('selected');
		}
		if (pais == '' || pais == null) return false;

		var size = Object.size(itc.monedas_formulario);

		if (size > 1) {

			$('.allcardcateg').addClass('hide');
			if (itc.id_formulario != 1212) {
				itc.clearCategorias();
			}

		}

		$.each(itc.monedas_formulario, function (k, v) {
			var mpais = String(v.pais);
			if (mpais != '' && mpais == pais) {
				itc.id_moneda = v.id_moneda;
				$('.simbMon').html(v.signo);
				itc.setCategoriaPais('show', v.id_moneda);
				cargmon = true;
				restmndo = 0;
				return true;
			} else if ((mpais == '' || mpais == 'null') && !cargmon) {
				restmndo = v.id_moneda;
				restosigno = v.signo;
			} else if ((mpais == '' || mpais == 'null') && $('[name="invitacion"]').val() != '' && !cargmon) {
				var issmsel = false;
				$("[id^=cardcate_" + v.id_moneda + "_]").each(function () {
					if ($(this).data('selected')) {
						itc.setCategoriaPais('show', v.id_moneda);
					}
				});
			}
		});
		if (restmndo != 0) {
			itc.id_moneda = restmndo;
			$('.simbMon').html(restosigno);
			itc.setCategoriaPais('show', restmndo);
		}
		this.setFormaPagoPais(pais);
		//forzar codigo de descuento a identificarse
		$("[name=codigo_descuento\\[\\]]").focusin().focusout();
	},

	setDatosFacturacion: function (pais) {
		if (pais == '') {
			pais = $('*[data-comodin="{%PAISES%}"]').data('selected');
		}
		if (pais == '' || pais == null) return false;
		if (pais.toUpperCase() == 'ARGENTINA') {
			if (!itc.esInvitacion) {
				$('#ft_tipoComprobante').val("");
				$('#ft_TipoIdTributario').val("");
			}
			$("#ft_tipoComprobante option[value='1']").removeAttr("disabled");
			$("#ft_tipoComprobante option[value='6']").removeAttr("disabled");
			$("#ft_TipoIdTributario option[value='PASAPORTE']").prop("disabled", true);
			$("#ft_TipoIdTributario option[value='CUIT']").removeAttr("disabled");
			$("#ft_TipoIdTributario option[value='CUIL']").removeAttr("disabled");
			$("#ft_TipoIdTributario option[value='DNI']").removeAttr("disabled");
			$('#ft_tipoComprobante').select2();
			$('#ft_TipoIdTributario').select2();
		} else {
			//GHW
			$('#ft_tipoComprobante').val("6");
			$('#ft_tipoComprobante').prop("selected", true);
			// $('#ft_TipoIdTributario').val("PASAPORTE");
			$("#ft_TipoIdTributario option[value='PASAPORTE']").prop("selected", true);
			$("#ft_tipoComprobante option[value='1']").prop("disabled", true);
			$("#ft_tipoComprobante option[value='6']").removeAttr("disabled");
			$("#ft_TipoIdTributario option[value='CUIT']").prop("disabled", true);
			$("#ft_TipoIdTributario option[value='CUIL']").prop("disabled", true);
			$("#ft_TipoIdTributario option[value='DNI']").prop("disabled", true);
			$("#ft_TipoIdTributario option[value='PASAPORTE']").removeAttr("disabled");
			$('#ft_tipoComprobante').select2();
			$('#ft_TipoIdTributario').select2();
		}
	},

	setCategoriaPais: function (doac, idmon) {
		if (doac == 'show') {
			$('.categmon' + idmon).removeClass('hide');

		}
	},

	setFormaPagoPais: function (pais) {
		// debugger;
		if (itc.datosFormasPagosPais == '')
			return;
		var hup = false;
		$('input[name="pago"]').val('');
		$('input[name="id_entidad_pago"]').val('');
		$('.pagos-descripcion').removeClass('active');
		$('.metodopago').each(function () {
			var p = $(this).data('pais');
			$(this).parent().removeClass('active');
			$(this).parent().addClass('hide');
			if (p == pais || p == 'todos') {
				$(this).parent().removeClass('hide');
				hup = true;
			} else if (pais != 'Argentina' && p == 'exterior') {
				$(this).parent().removeClass('hide');
				hup = true;
			}
			if ($(this).data('default') == '1' && !$(this).parent().hasClass('hide')) {
				// $(this).parent('li').addClass('active');
				var id_metodo_pago = $(this).data('pagoid');
				var id_entidad_pago = $(this).data('id_entidad_pago');
				var saldomp = $(this).data('saldomp');
				var indice = $(this).data('indice');
				$('a[href="#methpa_' + id_metodo_pago + '_' + indice + '"]').click()
				if (!itc.isValidMP(id_metodo_pago)) {
					$('input[name="pago"]').val('')
					$('input[name="id_entidad_pago"]').val('')
					return false;
				}
				$('input[name="pago"]').val(id_metodo_pago);
				$('input[name="id_entidad_pago"]').val(id_entidad_pago);
				$('input[name="con_saldo_mp"]').val(saldomp);
				itc.recargo = parseFloat($(this).data('recargo'));
				$('.porcen_recargo').html(itc.recargo);
				itc.calculeTotal();
			}
		});
		//cantidad medios de pago activos
		var col = 12 / $('ul.nav-pago li').not('.hide').length;

		$('ul.nav-pago li').not('.hide').each(function () {
			$(this).removeClass(function (index, className) {
				return (className.match(/(^|\s)col-\S+/g) || []).join(' ');
			});
			$(this).addClass('col-md-' + col);
		});

		if (!hup)
			$('.metodopago').each(function () {
				var p = $(this).data('pais');
				$(this).parent().removeClass('hide');
				if (p != '' && p != pais) {
					$(this).parent().addClass('hide');
				}
			});

	},

	validateDependency: function (el) {
		var dep = $(el).data('dependencia').split('|');
		if (dep.length == 0 || dep == '')
			return true;
		maxDependency = '';
		for (var i = 0; i < dep.length; i++) {
			el = dep[i]
			itc.dependencias[el] = 1;
			$('.cate_part:checked').each(function () {
				var catid = $(this).data('catid');
				var idmon = $(this).data('idmon');
				if (typeof $('#categoria_' + idmon + '_' + catid).data('dependencia') != 'undefined') {
					var d = $('#categoria_' + idmon + '_' + catid).data('dependencia').split('|');
					if (d.indexOf(el) > -1) {
						if (d.length > 1) {
							maxDependency = d;
						}
						itc.dependencias[el]++;
					}
				}
			});
			if (itc.dependencias[el] > 1) {
				if (dep.length > 1 && maxDependency.length > 1 && i == 0) {
					continue;

				}
				maxDependency = el;
				i = 999;
			}
		}
		// console.log(itc.dependencias);
		// if(itc.dependencias[dep] > 1)
		if (itc.dependencias[maxDependency] > 1) {
			return false;
		}
		return true;
	},

	borrarColaborador: function (id, posCol) {
		if (!confirm(itc._t('eliminar_colaborador'))) {
			return;
		}
		colId = id;
		if (itc.id_inscripcion) {
			$.ajax({
				url: itc.siteurl + "rest/v1/Colaborador/" + colId,
				type: 'GET',
				dataType: 'json',
				data: { formulario: itc.id_formulario, inscripto: itc.id_inscripcion },
			})
				.done(function (event) {
					jQuery("#colPuesto option").each(function () {
						if ($(this).val() == event.puesto) {
							newOption = $(this).val() + ' [' + event.CupoOcupado + '/' + $(this).data('total') + ']';
							$(this).text(newOption);
							if ($(this).prop("disabled") == true) {
								$(this).prop('disabled', false);
							}
						}
					});
					jQuery('#colPuesto').val("").select2();
					jQuery("#pos" + posCol).remove();

				});
		}
	},

	agregarTrabajoTl: function () {
		if (typeof $('#campostrabajos_0').html() == 'undefined')
			return false
		// debugger;
		var campostema = '<div id="campostrabajos_' + this.campostemarow + '">' + $('#campostrabajos_0').html() + '</div>';
		campostema = campostema.replace('campostrabajos_0', 'campostrabajos_' + this.campostemarow);
		// campostema = campostema.replace('[0]','['+this.campostemarow+']');
		campostema = campostema.replace(/\[0\]/g, '[' + this.campostemarow + ']');
		// console.log(campostema);
		// $('[data-form=select2]',campostema).select2();
		$('#campos_trabajos_libres').append(campostema);
		$('#campostrabajos_' + this.campostemarow + ' [name="tema_libre[modalidad][' + this.campostemarow + ']"').select2();
		$('#campostrabajos_' + this.campostemarow + ' [name="tema_libre[lista_1][' + this.campostemarow + ']"').select2();
		$('#campostrabajos_' + this.campostemarow + ' [name="tema_libre[lista_2][' + this.campostemarow + ']"').select2();
		var $input = $('#campostrabajos_' + this.campostemarow + ' [name="tema_libre[archivo][' + this.campostemarow + '][]"]');
		if ($input.length) {
			$input.fileinput({
				language: itc._t('locale'),
				maxFileSize: itc.maxFileSize,
			});
		}
		var $input = $('#campostrabajos_' + this.campostemarow + ' [name="tema_libre[archivo2][' + this.campostemarow + '][]"]');
		if ($input.length) {
			$input.fileinput({
				language: itc._t('locale'),
				maxFileSize: itc.maxFileSize,
			});
		}
		// $('#campostrabajos_'+this.campostemarow+' [type="text"],textarea,select').each(function(){
		$('#campostrabajos_' + this.campostemarow).find('[type="text"],select').each(function () {
			$(this).rules("add", { required: true });
		});
		this.registerTemasLibresCounter(this.campostemarow);
		this.campostemarow++;
		if (this.campostemarow > 1) {
			$('.btnagregartrabajo').text('AÃ±adir otro Trabajo');
		}
		return false;
	},

	registerTemasLibresCounter: function (campostemarow) {
		self = this;
		var tipocont = "word";
		var tipocontlbl = "palabras";
		if (self.tipocontadorPalabras == 'Letras') {
			var tipocont = "character";
			var tipocontlbl = "caracteres";
		}
		$('#campostrabajos_' + campostemarow + ' .counter').textcounter({
			type: tipocont,            // "character" or "word"
			min: 0,                      // minimum number of characters/words
			max: self.contadorPalabras,  // maximum number of characters/words, -1 for unlimited, 'auto' to use maxlength attribute
			countContainerElement: "div",                  // HTML element to wrap the text count in
			// countContainerClass      : "text-count-wrapper",   // class applied to the countContainerElement
			// inputErrorClass          : "error",                // error class appended to the input element if error occurs
			// counterErrorClass        : "error",                // error class appended to the countContainerElement if error occurs
			counterText: "Cantidad de " + tipocontlbl + ": %d",        // counter text
			errorTextElement: "div",                  // error text element
			minimumErrorText: "Minimum not met",      // error message for minimum not met,
			maximumErrorText: "Cantidad Maxiama excedida",     // error message for maximum range exceeded,
			displayErrorText: true,                   // display error text messages for minimum/maximum values
			stopInputAtMaximum: true,                   // stop further text input if maximum reached
			countSpaces: false,                  // count spaces as character (only for "character" type)
			countDown: true,                  // if the counter should deduct from maximum characters/words rather than counting up
			countDownText: "Cantidad de " + tipocontlbl + " restante: %d",          // count down text
			countExtendedCharacters: false,                  // count extended UTF-8 characters as 2 bytes (such as Chinese characters)
			maxcount: function (el) { },         // Callback: function(element) - Fires when the counter hits the maximum word/character count
			mincount: function (el) { },         // Callback: function(element) - Fires when the counter hits the minimum word/character count
			init: function (el) { }          // Callback: function(element) - Fires after the counter is initially setup
		});
		var tipocont = "word";
		var tipocontlbl = "palabras";
		if (self.tipocontadorPalabrasTrabajos == 'Letras') {
			var tipocont = "character";
			var tipocontlbl = "caracteres";
		}
		$('#campostrabajos_' + campostemarow + ' .countertrabajo').textcounter({
			type: tipocont,            // "character" or "word"
			min: 0,                      // minimum number of characters/words
			max: self.contadorPalabrasTrabajos,  // maximum number of characters/words, -1 for unlimited, 'auto' to use maxlength attribute
			countContainerElement: "div",                  // HTML element to wrap the text count in
			// countContainerClass      : "text-count-wrapper",   // class applied to the countContainerElement
			// inputErrorClass          : "error",                // error class appended to the input element if error occurs
			// counterErrorClass        : "error",                // error class appended to the countContainerElement if error occurs
			counterText: "Cantidad de " + tipocontlbl + ": %d",        // counter text
			errorTextElement: "div",                  // error text element
			minimumErrorText: "Minimum not met",      // error message for minimum not met,
			maximumErrorText: "Cantidad Maxiama excedida",     // error message for maximum range exceeded,
			displayErrorText: true,                   // display error text messages for minimum/maximum values
			stopInputAtMaximum: true,                   // stop further text input if maximum reached
			countSpaces: false,                  // count spaces as character (only for "character" type)
			countDown: true,                  // if the counter should deduct from maximum characters/words rather than counting up
			countDownText: "Cantidad de " + tipocontlbl + " restante: %d",          // count down text
			countExtendedCharacters: false,                  // count extended UTF-8 characters as 2 bytes (such as Chinese characters)
			maxcount: function (el) { },         // Callback: function(element) - Fires when the counter hits the maximum word/character count
			mincount: function (el) { },         // Callback: function(element) - Fires when the counter hits the minimum word/character count
			init: function (el) { }          // Callback: function(element) - Fires after the counter is initially setup
		});
	},

	registerButacas: function (sector) {
		var self = this;
		// addBlockContainer = jQuery(addBlockContainer);
		var attrid = 'seat-map' + self.seatmap;
		this.sc = jQuery('#modalbutacas').seatCharts({
			map: self.sectores[sector]['rows'],
			row_init: self.sectores[sector]['row_init'],
			row_inverted: self.sectores[sector]['row_inverted'],
			col_inverted: self.sectores[sector]['col_inverted'],
			seats: {
				a: {
					classes: 'economy-class', //your custom CSS class
					category: 'Butaca'
				},
				r: {
					price: 0,
					classes: 'setAside', //your custom CSS class
					category: 'Economy Class'
				}

			},
			naming: {
				top: false,
				left: true,
				getLabel: function (character, row, column) {
					// return self.firstSeatLabel++;
					return '<span title="Fila ' + row + ' - Butaca ' + column + '">' + column + '</span>';
				},
			},
			legend: {
				node: jQuery('.legend'),
				items: [
					// [ 'f', 'available',   'First Class' ],
					['a', 'available', 'Disponible'],
					['a', 'unavailable', 'Ocupada'],
					['p', 'unavailable', 'No Disponible'],
				]
			},
			click: function () {
				var butacas = itc.sc.find('selected');


				if (this.status() == 'available') {

					$(".targetSeatsButtons").find('span').removeAttr('disabled');

					if (butacas.length > itc.selectedTribuna[1] - 1) {


						if (!self.sectores[sector]['palco']) {
							// jQuery.each(butacas.seatIds,function(k,v){
							// 	itc.sc.status(v, 'available');
							// });


							alert('Tiene un maximo de ' + itc.selectedTribuna[1] + ' butacas para elegir. Si desea cambiar de butaca deseleccione una');
							return 'available';
						}
					} else {
						if (butacas.length + 1 == itc.selectedTribuna[1]) {

							$(".targetSeatsButtons").find('span').removeAttr('disabled');
							// $('#confirmarButacas').removeAttr('disabled');
						}
						return 'selected';
					}


				} else if (this.status() == 'selected') {
					return 'available';
				} else if (this.status() == 'unavailable') {
					return 'unavailable';
				} else {
					return this.style();
				}
			}
		});


		this.sc.get(self.sectores[sector]['unavailable']).status('unavailable');

		this.sc.get(self.sectores[sector]['SetAside']).status('unavailable');
		this.sc.get(self.sectores[sector]['SetAside']).node().addClass('setAside');

	},
	registerEvents: function () {
		var self = this;
		// self.registerBtnColEvent();
		if (self.id_formulario == 1611) {
			jQuery('#inputPrepand_10077880').on('change', function () {
				self.habilitarCategorias();
			});
			// debugger
			jQuery('#inputPrepand_10077879').focusin().focusout();
		}
	},
	summary: function (form) {

		$('#summary_modal').modal('show');
		viewportHeight = $(window).height() * 0.60;
		// console.log('viewportHeight:'+viewportHeight);
		$('#summary_modal').on('shown.bs.modal', function (event) {
			event.preventDefault();

			$('#summary_modal-body').css('height', viewportHeight);
			// $(this).find('.modal-body').css({
			//   'max-height': viewportHeight
			// });
			fila = '';
			tipo_dni = '';
			$("#form-wizard :input[data-cprincipal]").each(function () {
				campo = '';
				switch ($(this).data('cprincipal')) {
					case 1:
						campo = itc._t('apellido')
						$(this).val($(this).val().charAt(0).toUpperCase() + $(this).val().slice(1));
						break;
					case 2:
						campo = itc._t('nombre')
						$(this).val($(this).val().charAt(0).toUpperCase() + $(this).val().slice(1));
						break;
					case 3:
						campo = itc._t('EMA')
						break;
					case 4:
						campo = (tipo_dni == '') ? 'DNI' : tipo_dni;
						break;
					case 5:
						tipo_dni = $(this).val().replace(/\W/g, '')
						break;
				}
				if (campo != '') {
					fila += '<tr><td class="text-left" style="width:50%" nowrap="nowrap">' + campo + '</td><td class="col-sm-10 text-left" nowrap="nowrap"><b>' + $(this).val() + '</b></td></tr>';
				}
			});
			idmon = 0;
			grpNombre = '';
			$('.cate_part:checked').each(function () {
				idmon = $(this).data('idmon');
				idcat = $(this).data('catid');
				catNombre = $('#contcate_' + idmon + '_' + idcat + ' > h6').text();
				if (catNombre == '') {
					catNombre = $('#contcate_' + idmon + '_' + idcat + ' > h6').next().text();
				}
				catPrecio = $('#contcate_' + idmon + '_' + idcat + '> h2').text();
				catPrecio = catPrecio != '' ? catPrecio : '$ 0';
				catPrecioNro = catPrecio.split(' ');
				if (parseFloat(catPrecioNro[1]) < 1) catPrecio = 'Sin Cargo';
				else catPrecio = itc.monedas_formulario[idmon]['signo'] + catPrecioNro[1];

				var descripcionCategoria = '';
				arrayCat = [];
				for (var i in itc.categorias) {
					if (typeof itc.categorias[i] === 'object') {
						arrayCat = $.map(itc.categorias[i], function (value, index) {
							return [value];
						});
					} else {
						arrayCat = itc.categorias[i];
					}
					for (var ig = 0; ig < arrayCat.length; ig++) {
						if (idcat == arrayCat[ig]['id_categoria']) {
							if (grpNombre != i) {
								fila += '<tr><td class="text-left" style="width:50%" colspan="2" nowrap="nowrap"><b>' + i + '</b></td></tr>';
								descripcionCategoria = arrayCat[ig]['descripcion2'] ? arrayCat[ig]['descripcion2'] : '';
							}
						}
					}
				}

				var widthCat = 'width:50%';
				var catPrecioString = catPrecio;
				if (itc.sin_cargo == 1) {
					catPrecioString = descripcionCategoria;
					widthCat = '';
				}

				fila += '<tr><td class="text-left" style="' + widthCat + '" nowrap="nowrap">' + catNombre + '</td><td class="col-sm-10 text-left" nowrap="nowrap"><b>' + catPrecioString + '</b></td></tr>';

			});
			id_metodo_pago = jQuery('input[name=pago]').val();
			text_metodo_pago = '';
			for (var i in itc.datosFormasPagos) {
				itc.datosFormasPagos[i]['id_forma_pago'];
				if (itc.datosFormasPagos[i]['id_forma_pago'] == id_metodo_pago) {
					text_metodo_pago = itc.datosFormasPagos[i]['nombre'];
				}
			}

			if (itc.sin_cargo != 1) {
				fila += '<tr><td class="text-left" colspan="2"  nowrap="nowrap"><b>' + itc._t('pago_detalle') + '</b></tr>';
				fila += '<tr><td class="text-left" style="width:50%" nowrap="nowrap">' + itc._t('pago_forma') + '</td></td><td class="col-sm-10 text-left" nowrap="nowrap"><b>' + text_metodo_pago + '</b></td></tr>';
				fila += '<tr><td class="text-left"><h4 style="padding-top: 13px;"><b>Total</b></h4></td><td class="col-sm-3 text-center" nowrap="nowrap"><h3><b>' + itc.monedas_formulario[idmon]['signo'] + $(".cate_total").text() + '</b></h3></td></tr>';
			}

			$('#summaryBody').html(fila);
			fila = '';
		});

		$('#summary_modal').on('hidden.bs.modal', function (event) {
			$('.frmsbmtbtn').attr('disabled', false).html(itc.formVar);
			$('#summaryBody').html('');
		});

	},

	run_cdep: function (e) {
		checked = $(e).prop('checked');
		idCampo_princ = $(e).data('idcampo');
		// $(e).attr('disabled','disabled');
		id_collapse = $(e).data('collapset');
		$(id_collapse).trigger('click');
		$(itc.cdep).each(function (index, el) {
			name_campo_sec = 'input[name*="campo[' + el.id_campo_sec + ']"]';
			if ($(name_campo_sec).length == 0) {
				name_campo_sec = name_campo_sec.replace('input', 'select');
			}
			// debugger;
			if (el.id_campo_princ == idCampo_princ) {
				$id_grupo = $(name_campo_sec).closest('div[data-groupid]').data('groupid');
				if (el.requerido == 1) {
					if (checked == true) {
						$(name_campo_sec).rules("add", { required: true, messages: { required: itc._t('campo_requerido') } });
						$(name_campo_sec).prop("disabled", false);
					} else {
						$(name_campo_sec).rules("remove");
						$(name_campo_sec).rules("add", { required: false });
						$(name_campo_sec).prop("disabled", true);
					}
				} else if (el.no_requerido == 1) {
					$(name_campo_sec).rules("add", { required: false });
				} else if (el.valida == 1) {
					// console.log('valida');
				}
				if ($(name_campo_sec).data('id') == 'select_2') {
					$(name_campo_sec).trigger('change').select();
				}
			}
		});
		itc.calculeTotal();
	},
	checkVisa: function (e) {
		visa_origen = $(e).val();
		visa_destino = $(e).data('destino');
		// debugger;
		$.ajax({
			url: itc.siteurl + "rest/v1/checkVisa",
			type: 'GET',
			// dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
			async: false,
			dataType: "JSON",
			data: { origen: visa_origen, destino: visa_destino },
		})
			.success(function (e) {
				//console.log(e);debugger;
				if (e.success) {
					if (e.visa.normal == 1) {
						normal = itc._t('si');
					} else {
						normal = itc._t('no');
					}
					if (e.visa.otra == 1) {
						otra = itc._t('si');
					} else {
						otra = itc._t('no');
					}

					e.visa.otra;
					visatitulo = '<div style="background-color:red;border-radius: 18px;color:white;"><h4 class="title text-center" style="color:inherit;margin:0;">' + itc._t('importante') + '</h4><h5 class="title text-center" style="margin:0;color:inherit;">' + itc._t('pais_destino') + ' ' + visa_destino + '</h5>';
					visatitulo += '<h5 class="title text-center" style="color:inherit;text-shadow: 3px 1px #000000;">' + itc._t('visado') + '<br>ES REQUISITO TENER VISA</h5></div>';
					visatitulo += '<div style="display: flex;text-align: center;text-decoration: underline;"><a href="https://cancilleria.gob.ar/en/representaciones" target="_blank">Embassies and Consulates</a><a href="https://cancilleria.gob.ar/es/representaciones" target="_blank">Embajadas y Consulados</a></div>';
					table2 = visatitulo;
					table2 += '<table class="table table-striped" style="margin:0;">';
					table2 += '<thead><tr><th class="text-center" scope="col">' + itc._t('tipo') + '</th><th class="text-center" scope="col">' + itc._t('requerido') + '</th></tr></thead>';
					table2 += '<tbody><tr><td class="text-center">' + itc._t('turista') + '</td><td class="text-center"><b>' + normal + '</b></td></tr>';
					table2 += '<tr><td class="text-center">' + itc._t('diplomatico') + '/' + itc._t('servicio') + '</td><td class="text-center"><b>' + otra + '</b></td></tr>';
					table2 += '</tbody></table>';
					// jQuery('#myAlertMessage').children().removeClass('modal-sm').addClass('modal-md');
					$('#visa_message').val(visatitulo);
					itc._alertbox(table2);
					// jQuery('#myAlertMessage').children().removeClass('modal-lg').addClass('modal-sm');

				}
			});

	},

	alertISCT: function () {
		var message = '<p style="font-size: 1.3em;"><b>Su ISSCT ID todavÃ­a no se encuentra aÃºn en nuestra base de datos.' +
			' Si usted realiz&oacute; el pago recientemente, le rogamos esperar a la prÃ³xima actualizaciÃ³n y reintentar dentro de 24 hs.' +
			' Ante cualquier inconveniente escrÃ­banos a: registration@issct-argentina2019.com.</b></p>' +
			'<p style="font-size: 1.2em;">Your ISSCT ID is not yet in our database. If you just have made the payment recently,' +
			' please wait for the next update and retry in 24 hours. If you have any problem, write us: registration@issct-argentina2019.com</p>';
		itc._alertbox(message);
	},

	sendPromise: function (value, element) {
		var self = this;
		if (self.timer) {
			clearTimeout(self.timer);
		}
		// if(self.onajaxload){
		// 	return;
		// }

		var index = $(element).data('index');
		var id = element.id;
		var promise = new Promise(function (resolve, reject) {

			self.timer = setTimeout(function () {
				// $(element).blur();
				self.onajaxload = true;
				$.ajax({
					url: itc.siteurl + "rest/v1/verificarCodigo",
					type: "post",
					async: false,
					data: { _token: itc._token, code: value, idf: itc.id_formulario, index: index },
					dataType: "JSON",
					success: function (e) {
						// $('#api-loading').removeClass('noopacity');
						// console.log(e)
						// debugger;
						self.apiData = e.response;
						if (e.success) { //Email valido, no existe
							self.checkEmailAPIInfo(e.response, element);
							self.resultadoAPI = true;
						} else {
							$(element).closest('div').addClass('has-error').removeClass('has-success').find('i.material-icons').html('clear');
							self.alertISCT();
							self.resultadoAPI = false;
						}
						resolve(self.resultadoAPI);
					},
					complete: function () {
						self.onajaxload = false;
						// $(element).blur();
						$('#api-loading').addClass('siopacity').removeClass('noopacity');
					}
				});

			}, 3000);
		});
		return promise;
	},

	checkEmailAPIInfo: function (result, element) {
		var self = this;
		$("#myAlertMessage .modal-title").html(itc._t('completar_t'));
		$("#myAlertMessage .modal-dialog").removeClass('modal-sm');
		$("#myAlertMessage .modal-footer").html('');

		itc._alertbox('<center>' +
			itc._t('registration_email_request') + '.<br></center>' +
			// '<form id="formIDINSCREL" name="formIDINSCREL">'+
			'<div class="row">' +
			'<div class="col-sm-12" style="margin-top: 0px;">' +
			'<div class="form-group label-floating is-empty">' +
			'<label class="control-label">' + itc._t('email_membresia') + '</label>' +
			'<input type="text" name="email_membresia" value="" class="form-control" data-validate="{email: true}">' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div id="mme_msj" class="text-center text-danger"></div>' +
			'<div class="row">' +
			'<div class="col-sm-12 text-center">' +
			'<button type="button" class="btn btn-success pull-right continuar_membresia">' + itc._t('continuar') + '</button>' +
			'<button type="button" class="btn btn-default pull-right cancelar_membresia" data-dismiss="modal" aria-hidden="true">' + itc._t('cancelar') + '</button>' +
			'</div>' +
			'</div>' +
			// '</form>'+
			''
		);
		jQuery('.continuar_membresia').click(function () {
			var email_membresia = jQuery.trim(jQuery('[name="email_membresia"]').val());
			var email_sm = jQuery.trim(self.apiData.EMA);
			console.log(email_membresia, email_sm);
			if (email_membresia != email_sm) {
				jQuery('#mme_msj').html(self._t('error_verificar_email_membresia'));
				self.resultadoAPI = false;
				return false;
			}

			self.resultadoAPI = true;
			$(element).closest('div').addClass('has-success').removeClass('has-error').find('i.material-icons').html('done');
			self.loadInscriptoData(self.apiData);
			$("#myAlertMessage .close").click();

		});
		jQuery('.cancelar_membresia').click(function () {
			$(element).val('');
			$("#myAlertMessage .close").click();
			itc.valoranterior = '';
		});
		// itc.btncatelement = this;
		// var catid = $(this).data('catid');
		// var idmon = $(this).data('idmon');
		// itc.checkCodigoIDInscripto(idmon,catid);
	},

	loadInscriptoData: function (result) {
		// console.log(result);
		// 20190129. Guillo Autino: bloqueo de carga automatica porque esta pisando nombre y apellido porque en la db esta cargado al reves
		return false;
		$('*[data-codexls]').each(function (k, v) {
			var codexls = $(this).data('codexls');
			if (typeof result[codexls] != 'undefined') {
				var valor = result[codexls];
				if (valor != '') {
					// console.log(valor);
					if ($(this).prop('type').match(/select/)) {
						valor = valor.capitalize();
						$(this).val(valor).trigger('change.select2').parent().removeClass('is-empty');
					} else {
						$(this).val(valor).parent().removeClass('is-empty');
					}
				}
			}
			// console.log();
		});
	},

	chequearSeleccionCategoriaxGrupo: function () {
		var self = this;
		//chequear si los grupos de categorias son boligatorios y tienen alguna categoria seleccionada
		var alertcateg = false;
		var id_paso = '';
		var legend = '';
		var catsEnGruposObligatorios = 0;
		$('.grupos_categorias').each(function () {
			var cantidad = 0;
			let grupoOculto = $(this).hasClass('hide');
			if ($(this).data('tipo2') == 'inscripcion' && !grupoOculto) {
				// if($(this).find('.cate_part:checked').length <=0){
				// 	alertcateg = true;
				// 	id_paso = this.id;
				// 	legend = $('#'+id_paso).find('legend').text().replace(/\keyboard_arrow_down/g,'');
				// 	return false;
				// }
				$(this).find('.cate_part').each(function () {
					var cupo = parseInt($(this).data('cupo'));
					var cupototal = parseInt($(this).data('cupototal'));
					if (cupo > 0 && $(this).prop('checked')) {
						cantidad++;
					} else if (cupo <= 0 && cupototal > 0 && $(this).prop('checked')) {
						cantidad++;
					} else if (cupo <= 0 && cupototal <= 0 && $(this).prop('checked')) {
						cantidad++;
					} else if ($(this).data('catpaga') == '1') {
						cantidad++;
					}
				});
				if (cantidad <= 0) {
					alertcateg = true;
					id_paso = this.id;
					legend = $('#' + id_paso).find('legend').text().replace(/keyboard_arrow_down/g, '');
					return false;
				}
				catsEnGruposObligatorios = + cantidad;
			}
		});

		if (alertcateg) {
			var addmsg = '';
			if (itc.id_formulario == 1439) {
				addmsg = '<br><br><b>MUY IMPORTANTE:</b> <i>Es obligatorio seleccionar una actividad en cada bloque horario para poder concluir su inscripciÃ³n, salvo que en un bloque se agote el cupo disponible.</i>';
			}
			self._alertbox(self._t('debe_seleccionar_categoria') + ' en el grupo <b>' + legend + '</b>' + addmsg);
			$([document.documentElement, document.body]).animate({
				scrollTop: $("#" + id_paso).parent().parent().offset().top
			}, 1000);
			return false;
		}
		if (self.sin_cargo != '1' && catsEnGruposObligatorios > 0) {

			if ($('input[name="pago"]').val() == "" && self.Total > 0) {
				self._alertbox(self._t('debe_seleccionar_pago'));
				return false;
			}
			if (itc.getCantidadCategorias() <= 0) {
				self._alertbox(self._t('debe_seleccionar_categoria'));
				return false;
			}
		}
		return true;
	},

	habilitarCategorias: function () {
		var self = this;
		// self.clearCategorias();
		$('.allcardcateg').addClass('hide');
		var essocio = false;
		if (typeof self.dataresultadoDNI.socio == 'undefined') {
			return;
		}
		$('.grp2462').removeClass('hide');
		$("#contactotesoreria").remove();
		if (typeof self.dataresultadoDNI.socio != 'undefined' && typeof self.dataresultadoDNI.socio.id != 'undefined') {
			$('.btn-bd').html('<b>SI ES</b> SOCIO SAO CUOTA AL D&Iacute;A').css('background-color', '#5a924c').show();
			essocio = true;
			//habilita grupo de actividades
			$('.grp2476').removeClass('hide');
			$('.grp2476 input,.grp2476 select,.grp2476 textarea').prop('disabled', false);
			jQuery("[name='campo[10077955]']").val('Si').trigger("change");
			jQuery("[name='campo[10077875]']").val(self.dataresultadoDNI.socio.APE).trigger("change");
			jQuery("[name='campo[10077876]']").val(self.dataresultadoDNI.socio.NOM).trigger("change");
			jQuery("[name='campo[10077877]']").val(self.dataresultadoDNI.socio.EMA).trigger("change");
			jQuery("#reemail_10077877").val(self.dataresultadoDNI.socio.EMA).trigger("change");
		} else {
			$('.btn-bd').html('NO ES SOCIO SAO CUOTA AL D&Iacute;A').css('background-color', 'red').show();
			$('#inputPrepand_10077879').parent('div').append('<b id="contactotesoreria"><i>Por consultas contactar a <a style="color:#0088fe;" href="mailto:tesoreria@sao.org.ar">tesoreria@sao.org.ar</a></i></b>');
			$('.grp2476').addClass('hide');
			$('.grp2476 input,.grp2476 select,.grp2476 textarea').prop('disabled', true);
			jQuery("[name='campo[10077955]']").val('No').trigger("change");
			// jQuery("[name='campo[10077875]']").val("");
			// jQuery("[name='campo[10077876]']").val("");
			// jQuery("[name='campo[10077877]']").val("");
			// jQuery("#reemail_10077877").val("").trigger("change");
		}
		//ajustar en prod
		var fecha = jQuery('#inputPrepand_10077880').val();
		var edad = self.getEdad(fecha);
		// console.log(edad);
		$('.allcardcateg').each(function () {
			var data = $(this).find('.card').attr('id').split('_');
			if (essocio && parseInt(data[2]) == 4844) {
				$(this).removeClass('hide');
			} else if (!essocio && edad < 35 && parseInt(data[2]) == 4859) {
				$(this).removeClass('hide');
			} else if (!essocio && edad >= 35 && parseInt(data[2]) == 4858) {
				$(this).removeClass('hide');
			}
			if (!essocio && (parseInt(data[2]) == 4923 || parseInt(data[2]) == 4924)) {
				//EXPOSITOR COMERCIAL
				$(this).removeClass('hide');
			}
			if (parseInt(data[1]) == self.id_moneda && parseInt(data[2]) == 4922) {
				$(this).removeClass('hide');
			}
		});
	},

	habilitarCategorias1656: function () {
		var self = this;
		// self.clearCategorias();
		// $('.allcardcateg').addClass('hide');
		var essocio = false;
		if (typeof self.dataresultadoDNI.socio == 'undefined') {
			return;
		}
		// $('.grp2462').removeClass('hide');
		$("#contactotesoreria").remove();
		if (typeof self.dataresultadoDNI.socio != 'undefined' && typeof self.dataresultadoDNI.socio.id != 'undefined') {
			$('.btn-bd').html('<b>SI ES</b> SOCIO SAO CUOTA AL D&Iacute;A').css('background-color', '#5a924c').show();
			essocio = true;
			//habilita grupo de actividades
			$('.grp2572').removeClass('hide');
			$('.grp2573').addClass('hide');
			$('#cardcate_277_5008').parent().removeClass('hide');
			$('#cardcate_277_5009').parent().addClass('hide');
			// $('.grp2476 input,.grp2476 select,.grp2476 textarea').prop('disabled',false);
			// jQuery("[name='campo[10078488]']").val('SI').trigger("change");
			// jQuery("[name='campo[10078488]']").html('<option>SI</option>').val('SI').trigger("change");
			jQuery("[name='campo[10078482]']").val(self.dataresultadoDNI.socio.APE).trigger("change");
			jQuery("[name='campo[10078483]']").val(self.dataresultadoDNI.socio.NOM).trigger("change");
			jQuery("[name='campo[10078484]']").val(self.dataresultadoDNI.socio.EMA).trigger("change");
			jQuery("#reemail_10078484").val(self.dataresultadoDNI.socio.EMA).trigger("change");
		} else {
			$('.btn-bd').html('NO ES SOCIO SAO CUOTA AL D&Iacute;A').css('background-color', 'red').show();
			$('#inputPrepand_10078486').parent('div').append('<b id="contactotesoreria"><i>Por consultas contactar a <a style="color:#0088fe;" href="mailto:tesoreria@sao.org.ar">tesoreria@sao.org.ar</a></i></b>');
			$('.grp2572').addClass('hide');
			$('.grp2573').removeClass('hide');
			$('#cardcate_277_5008').parent().addClass('hide');
			$('#cardcate_277_5009').parent().removeClass('hide');
			// $('.grp2476 input,.grp2476 select,.grp2476 textarea').prop('disabled',true);
			// jQuery("[name='campo[10078488]']").html('<option>NO</option>').val('NO').trigger("change");
			// jQuery("[name='campo[10077875]']").val("");
			// jQuery("[name='campo[10077876]']").val("");
			// jQuery("[name='campo[10077877]']").val("");
			// jQuery("#reemail_10077877").val("").trigger("change");
		}
		//ajustar en prod
		// var fecha = jQuery('#inputPrepand_10077880').val();
		// var edad = self.getEdad(fecha);
		// // console.log(edad);
		// $('.allcardcateg').each(function(){
		// 	var data = $(this).find('.card').attr('id').split('_');
		// 	if(essocio && parseInt(data[2]) == 4844){
		// 	    $(this).removeClass('hide');
		// 	}else if(!essocio && edad < 35 && parseInt(data[2]) == 4859){
		// 		$(this).removeClass('hide');
		// 	}else if(!essocio && edad >= 35 && parseInt(data[2]) == 4858){
		// 		$(this).removeClass('hide');
		// 	}
		// 	if(!essocio && (parseInt(data[2]) == 4923 || parseInt(data[2]) == 4924)){
		// 		//EXPOSITOR COMERCIAL
		// 		$(this).removeClass('hide');
		// 	}
		// 	if (parseInt(data[1]) == self.id_moneda && parseInt(data[2]) == 4922) {
		// 		$(this).removeClass('hide');
		// 	}
		// });
	},
	habilitarCategorias1961: function () {
		var self = this;

		var essocio = false;
		if (typeof self.dataresultadoDNI.socio == 'undefined') {
			return;
		}

		$("#contactotesoreria").remove();
		if (typeof self.dataresultadoDNI.socio != 'undefined' && typeof self.dataresultadoDNI.socio.id != 'undefined') {
			$('.btn-bd').html('<b>SOCIO UNAJE</b>').css('background-color', '#5a924c').show();
			essocio = true;
			//habilita grupo de actividades
			$('.grp3296').removeClass('hide');
			// $('.grp3291').addClass('hide');
			// $('#cardcate_277_5008').parent().removeClass('hide');
			// $('#cardcate_277_5009').parent().addClass('hide');
			// jQuery("[name='campo[10078482]']").val(self.dataresultadoDNI.socio.APE).trigger("change");
			// jQuery("[name='campo[10078483]']").val(self.dataresultadoDNI.socio.NOM).trigger("change");
			// jQuery("[name='campo[10078484]']").val(self.dataresultadoDNI.socio.EMA).trigger("change");
			// jQuery("#reemail_10078484").val(self.dataresultadoDNI.socio.EMA).trigger("change");
		} else {
			// $('.btn-bd').html('NO ES SOCIO SAO CUOTA AL D&Iacute;A').css('background-color', 'red').show();
			$('.btn-bd').hide();
			// $('#inputPrepand_10078486').parent('div').append('<b id="contactotesoreria"><i>Por consultas contactar a <a style="color:#0088fe;" href="mailto:tesoreria@sao.org.ar">tesoreria@sao.org.ar</a></i></b>');
			$('.grp3296').addClass('hide');
			// $('.grp3291').removeClass('hide');
			// $('#cardcate_277_5008').parent().addClass('hide');
			// $('#cardcate_277_5009').parent().removeClass('hide');

		}
	},

	getEdad: function (fecha) {
		var today = new Date();
		var f = fecha.split('/');
		var birthDate = new Date(f[2] + '-' + f[1] + '-' + f[0]);
		var edad = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			edad--;
		}
		return parseInt(edad);
	}

} // end fin ITC


$(document).on("ready", function () {

	itc.onReady = true;

	itc.registerEvents();

	$('.btn-tooltip').tooltip();

	$('.cards').on('click', '.categoryselector', function () {
		var catid = $(this).data('catid');
		var idmon = $(this).data('idmon');
		var paso = $(this).data('paso');
		var link = $(this).data('link');
		var id_group = $(this).data('groupid');

		if ($(this).attr('disabled') == "disabled") {
			return false;
		}

		if ($('#categoria_' + idmon + '_' + catid).is(':radio')) {
			$('#paso_' + paso + ' .categoryselector').each(function () {
				var cid = $(this).data('catid');
				var mid = $(this).data('idmon');
				if (cid != catid) {
					id_group = $(this).data('groupid');
					if (itc.trans['categoria_seleccionar_grupo'][id_group]) {
						$(this).text(itc.trans['categoria_seleccionar_grupo'][id_group]);
					} else {
						$(this).text(itc._t('categoria_seleccionar'));
					}
					// $(this).text(itc._t('categoria_seleccionar'));
					$(this).removeClass('btn-white').addClass('btn-success');
					$('#categoria_' + mid + '_' + cid).prop('checked', false);
					$('#cardcate_' + mid + '_' + cid).removeClass('card-raised').addClass('card-plain');
					$('#contcate_' + mid + '_' + cid).removeClass('content-success');
					itc.validarDependenciaCategoriaGrupo(false, cid);
					const index = itc.click_cat_order.indexOf(paso + '_' + mid + '_' + cid);
					if (index > -1) {
						itc.click_cat_order.splice(index, 1);
						$('#categoriasc_' + mid + '_' + cid).remove();
						$('#codigoaplica_' + mid + '_' + cid).remove();
						$('#codigoaplicaprecio_' + mid + '_' + cid).remove();
					}
				}
			});
		}
		if ($('#categoria_' + idmon + '_' + catid).prop('checked')) {
			const index = itc.click_cat_order.indexOf(paso + '_' + idmon + '_' + catid);
			if (index > -1) {
				itc.click_cat_order.splice(index, 1);
				$('#categoriasc_' + idmon + '_' + catid).remove();
				$('#codigoaplica_' + idmon + '_' + catid).remove();
				$('#codigoaplicaprecio_' + idmon + '_' + catid).remove();
			}
			itc.disableCategoria(this, catid, idmon);
		} else {
			if (link) {
				window.open(link, "_blank");
			}
			//Valida Maxiama seleccion de categorias

			if (typeof id_group === 'undefined' || id_group != null) {
				groupid = $('#categoria_' + idmon + '_' + catid).closest("div[data-groupid]").data('groupid');
			}

			cantidad = itc.getCantidadCategorias();

			if (itc.maximoCategoria != '' && itc.maximoCategoria > 0) {
				cantidad = itc.getCantidadCategorias();
				if (cantidad >= itc.maximoCategoria) {
					itc._alertbox(itc.TXTmaximoCategoria ? itc.TXTmaximoCategoria : itc._t('maximo_categoria_alcanzado'));
					return false;
				}
			} else if (itc.gruposLimite[id_group] > 0) {
				if (cantidad >= itc.gruposLimite[id_group]) {
					itc._alertbox(itc.TXTmaximoCategoria ? itc.TXTmaximoCategoria : itc._t('maximo_categoria_alcanzado'));
					return false;
				}
			}
			if (!itc.validateDependency(this)) {
				itc._alertbox(itc.TXTmaximoCategoria ? itc.TXTmaximoCategoria : itc._t('maximo_categoria_alcanzado'));
				return false;
			}
			itc.click_cat_order.push(paso + '_' + idmon + '_' + catid);
			//Valida Si requiere codigo para seleccionar
			if ($(this).data('reqcodigo') == '1') {
				$cdcatuse = [];
				value = '';
				if (typeof itc.codigoInvitado != 'undefined') {
					if (itc.codigoInvitado != null) {
						$.each(itc.codigoInvitado, function (kin, ci) {
							ci.categorias_usadas.split(',').forEach(function (index, el) {

								$cdcatuse.push(parseInt(index));
							});;

							if ($cdcatuse.indexOf(catid) != -1) {
								value = ci.codigo;
							}
						});
					}
				}

				if (itc.id_formulario == 1259) {
					textoReqCodigo = itc._t('categoria_con_codigo') + '<hr>You have selected a category that requires a special code. Please enter the code below';
					textoField = 'Ingrese su cÃ³digo / Enter your Code';
				} else {
					textoReqCodigo = itc._t('categoria_con_codigo');
					textoField = 'Ingrese su cÃ³digo';
				}
				itc._alertbox(textoReqCodigo + '<br>' +
					'<div class="row">' +
					'<div class="form-group codigoxcategoria">' +
					'<input type="text" name="codigo_x_categoria" data-checkcate="' + catid + '" data-idmon="' + idmon + '" value="" class="form-control" placeholder="' + textoField + '">' +
					'<label for="codigo_x_categoria" generated="true" class="text-danger"></label>' +
					'<span class="material-icons form-control-feedback">clear</span>' +
					'</div>' +
					'</div>'
				);

				if (value != '') {
					// $('[name="codigo_x_categoria"]').trigger('change');
					$('[name="codigo_x_categoria"]').val(value);
					jQuery('#myAlertMessage').modal('hide');
				}
				itc.btncatelement = this;
				itc.checkCodigoxCategoria();
			} else if ($(this).data('reqclublg') == '1') {
				//requiere codigo club la gaceta
				$cdcatuse = [];
				value = '';
				if (typeof itc.codigoInvitado != 'undefined') {
					if (itc.codigoInvitado != null) {
						$.each(itc.codigoInvitado, function (kin, ci) {
							ci.categorias_usadas.split(',').forEach(function (index, el) {

								$cdcatuse.push(parseInt(index));
							});;

							if ($cdcatuse.indexOf(catid) != -1) {
								value = ci.codigo;
							}
						});
					}
				}
				$("#myAlertMessage .modal-title").html('Tarjeta Club La Gaceta');
				$("#myAlertMessage .modal-dialog").removeClass('modal-sm');
				$("#myAlertMessage .modal-footer").html('');
				var valdni = '';
				var emptydni = 'is-empty';
				$('input[type=text]').each(function () {
					if ($(this).data('type') == 'dni' && $(this).val() != '') {
						valdni = $(this).val();
						emptydni = '';
					}
				});
				itc._alertbox('<center><img src="' + itc.siteurl + 'img/club-la-gaceta.jpg" style="width: 150px;"/><br><br>' +
					'Ha seleccionado una categor&iacute;a que requiere los datos de la Tarjeta Club La Gaceta<br></center>' +
					'<form id="formCLG" name="formCLG">' +
					'<div class="row">' +
					'<div class="col-sm-12">' +
					'<div class="form-group label-floating ' + emptydni + '">' +
					'<label class="control-label">DNI</label>' +
					'<input type="text" name="clublg_dni" data-checkcate="' + catid + '" data-idmon="' + idmon + '" value="' + valdni + '" class="form-control" data-validate="{number: true}">' +
					'</div>' +
					'</div>' +
					'<div class="col-sm-12" style="margin-top: 0px;">' +
					'<div class="form-group label-floating is-empty">' +
					'<label class="control-label">Ingrese los ultimos 8 digitos de su tarjeta</label>' +
					'<input type="text" name="clublg_idsocio" data-checkcate="' + catid + '" data-idmon="' + idmon + '" value="" class="form-control" data-validate="{number: true,maxlength:8}">' +
					'</div>' +
					'</div>' +
					'</div>' +
					'<div id="clg_msj" class="text-center text-danger"></div>' +
					'<div class="row">' +
					'<div class="col-sm-12 text-center">' +
					'<button type="submit" class="btn btn-success pull-right">Continuar</button>' +
					'<button type="button" class="btn btn-default pull-right" data-dismiss="modal" aria-hidden="true">Cancelar</button>' +
					'</div>' +
					'</div>' +
					'</form>' +
					''
				);
				// $('[name="clublg_dni]"').rules("remove");
				// $('[name="clublg_idsocio]"').rules("remove");
				// $('[name="clublg_dni]"').rules("add",{
				// 	number:true,
				// });
				// $('[name="clublg_idsocio]"').rules("add",{
				// 	number:true,
				// });

				if (value != '') {
					// $('[name="codigo_x_categoria"]').trigger('change');
					$('[name="clublg_idsocio"]').val(value);
					$('[name="clublg_idsocio"]').closest('div.form-group').removeClass('is-empty');
					// jQuery('#myAlertMessage').modal('hide');
				}
				itc.btncatelement = this;
				var catid = $(this).data('catid');
				var idmon = $(this).data('idmon');
				itc.checkCodigoLG(idmon, catid);
			} else if ($(this).data('reqidinscr') == '1') {
				//requiere codigo id inscripto

				$("#myAlertMessage .modal-title").html(itc._t('completar_t'));
				$("#myAlertMessage .modal-dialog").removeClass('modal-sm');
				$("#myAlertMessage .modal-footer").html('');

				itc._alertbox('<center>' +
					itc._t('membresia_1') + '.<br></center>' +
					'<form id="formIDINSCREL" name="formIDINSCREL">' +
					'<div class="row">' +
					'<div class="col-sm-12">' +
					'<div class="form-group label-floating is-empty">' +
					'<label class="control-label">' + itc._t('membresia_3') + '</label>' +
					'<input type="text" name="idinscr_dni" data-checkcate="' + catid + '" data-idmon="' + idmon + '" value="" class="form-control" data-validate="{required: true}">' +
					'</div>' +
					'</div>' +
					'<div class="col-sm-12" style="margin-top: 0px;">' +
					'<div class="form-group label-floating is-empty">' +
					'<label class="control-label">' + itc._t('membresia_2') + '</label>' +
					'<input type="text" name="codigo_inscr" data-checkcate="' + catid + '" data-idmon="' + idmon + '" value="" class="form-control" data-validate="{number: true,maxlength:8}">' +
					'</div>' +
					'</div>' +
					'</div>' +
					'<div id="clg_msj" class="text-center text-danger"></div>' +
					'<div class="row">' +
					'<div class="col-sm-12 text-center">' +
					'<button type="submit" class="btn btn-success pull-right">' + itc._t('continuar') + '</button>' +
					'<button type="button" class="btn btn-default pull-right" data-dismiss="modal" aria-hidden="true">' + itc._t('cancelar') + '</button>' +
					'</div>' +
					'</div>' +
					'</form>' +
					''
				);

				itc.btncatelement = this;
				var catid = $(this).data('catid');
				var idmon = $(this).data('idmon');
				itc.checkCodigoIDInscripto(idmon, catid);
			} else {
				itc.enableCategoria(this, catid, idmon);
			}

		}
		itc.calculeTotal();
	});

	$('.categoryselector').each(function () {
		if ($(this).data('selected')) {
			$(this).trigger('click');
		}
	});

	/*
	* Categorias de Inscripcion
	*/
	//calcula Total
	$('.cate_part').on('click', function (e) {
		// console.log($(this).prop('checked'));
		itc.calculeTotal();
	});

	$('.c-readmore').on('click', function (e) {
		var cateid = $(this).data('cateid');
		var idmon = $(this).data('idmon');
		if ($("#catedesc_" + idmon + '_' + cateid).hasClass("lngtext")) {
			$("#catedesc_" + idmon + '_' + cateid).removeClass("lngtext");
			// $(this).text('Leer mÃ¡s');
			$(this).text(itc._t('leer_mas'));
		} else {
			$("#catedesc_" + idmon + '_' + cateid).addClass("lngtext");
			// $(this).text('Cerrar');
			$(this).text(itc._t('leer_mas_cerrar'));
		}
	});

	$("select[name^='cantidad_categorias']").on('change', function () {
		cantidad = itc.getCantidadCategorias();
		if (itc.maximoCategoria > 0 && cantidad > itc.maximoCategoria) {
			itc._alertbox(itc.TXTmaximoCategoria ? itc.TXTmaximoCategoria : itc._t('maximo_categoria_alcanzado'));
			$(this).val('1').trigger("change");
			return false;
		}
		itc.calculeTotal();
	});

	/*
	* Metodos de pago
	*/
	//calcula Total
	$('.metodopago').on('click', function (e) {
		var id_metodo_pago = $(this).data('pagoid');
		var id_entidad_pago = $(this).data('id_entidad_pago');
		var saldomp = $(this).data('saldomp');
		if (!itc.isValidMP(id_metodo_pago)) {
			$('input[name="pago"]').val('')
			return false;
		}
		$('input[name="pago"]').val(id_metodo_pago);
		$('input[name="id_entidad_pago"]').val(id_entidad_pago);
		$('input[name="con_saldo_mp"]').val(saldomp);
		itc.recargo = parseFloat($(this).data('recargo'));
		$('.porcen_recargo').html(itc.recargo);
		itc.calculeTotal();
	});
	//Setea default
	$('.metodopago').each(function (e) {
		if ($(this).data('default') == '1') {
			$(this).parent('li').addClass('active');
			var id_metodo_pago = $(this).data('pagoid');
			if (!itc.isValidMP(id_metodo_pago)) {
				$('input[name="pago"]').val('')
				return false;
			}
			$('input[name="pago"]').val(id_metodo_pago);
			itc.recargo = parseFloat($(this).data('recargo'));
			$('.porcen_recargo').html(itc.recargo);
			itc.calculeTotal();
		}
	});



	$("input[id *= inputUpload]").on("change", function () {
		// Validar aqui...
		var id = $(this).attr("data-inputload");
		//alert(id);
		$("#cargando" + id).show();
		document.getElementById("form-cargar-imagen" + id).submit();
		$("#cargar-imagen" + id).css("height", "500px");
		$("#cargarArchivo" + id).show();
		setTimeout(itc.ocultarCargando(id), 3000);
	});

	$("[name=codigo_descuento\\[\\]]").on("change keyup", function () {
		var val = $.trim($(this).val());
		val = val.replace(/(\r\n|\n|\r)/gm, "");
		$(this).val(val);
	});

	$(".cod_descuento").on("change keyup", function () {
		var val = $.trim($(this).val());
		val = val.replace(/(\r\n|\n|\r)/gm, "");
		$("[name=codigo_descuento\\[\\]]").val(val).trigger("change");
		$("[name=codigo_descuento\\[\\]]").attr('readonly', true);
		// jQuery.validator.methods.codigodescuento(val,$("[name=codigo_descuento\\[\\]]"));
		// console.log(getr);
	});

	/*
	*
	*/
	itc.Formvalidator = $('#form-wizard').validate({
		ignore: '.ignore',
		submitHandler: function (form) {
			//chequear seleccion de categorias
			if (!itc.chequearSeleccionCategoriaxGrupo()) {
				return false;
			}
			// return false;
			if ($('#hiddenButacas').val() == '') {
				alert('Â¡Por Favor. Realize la SelecciÃ³n de Butacas para continuar con su inscripciÃ³n!');
				return false;
			}

			if (itc.id_formulario == 1212 && itc.resultadoAPI == false) {
				itc.alertISCT();
				return false;
			}

			var cupo_cumplido = false;
			var categorias = [];
			if (jQuery('.cate_part:checked').length >= 1) {
				$('.cate_part:checked').each(function () {
					idcat = $(this).data('catid');
					idmon = itc.id_moneda;
					var array = [idcat, idmon];
					categorias.push(array);

				}); // fin checked
			}

			if (itc.id_formulario != 1348) {
				$.ajax({
					url: itc.siteurl + "rest/v1/getCuposDinamicos",
					type: 'GET',
					async: false,
					dataType: 'JSON',
					data: { categorias: categorias, id_inscripcion: itc.id_inscripcion },
				})
					.success(function (e) {
						if (e.cupoCumplido == true) {
							itc._alertbox(itc._t('cupo_alert'));
							for (var idCategoria in e.data.catCupoCumplido) {
								idMon = e.data.catCupoCumplido[idCategoria]['id_moneda'];
								$('#btncat_' + idmon + '_' + idCategoria).addClass('disabled');
								$('#contcate_' + idmon + '_' + idCategoria + '>ul>li').html('<span class="text-danger tcupocateg" style="font-size:2em;font-weight: bold;"><i class="material-icons" style="top: 0px;">error_outline</i>' + itc._t('cupo_message') + '</span>');
								jQuery('#btncat_' + idmon + '_' + idCategoria).trigger('click');
							}
							itc.submit_flag = false;
						}
					}); // fin apjax
			}

			if (itc.submit_flag == true) {
				//deshabilita campos que fueron inhabilitados por categorias ocultas
				$('input,select,textarea').prop('disabled', false);
				itc.formVar = $('.frmsbmtbtn').html();
				// $('.frmsbmtbtn').attr('disabled',true).html('Aguarde... <i class="material-icons">watch_later</i><div class="ripple-container"></div>');
				$('.frmsbmtbtn').attr('disabled', true).html('Aguarde...&nbsp;&nbsp;&nbsp;&nbsp;<img style="position: absolute;width: 45px;top: 5px;right: 10px;" src="https://intercloudy.contilatam.com/img/loading_spinner_64px.gif"><div class="ripple-container"></div>');
				if (itc.resumen == 1) {
					itc.summary(form);
					$('.summaryButton').click(function (event) {
						form.submit();
					});
				} else {
					if (itc.esInvitacion == 'true') {
						$('.bigdata_inscripcion').removeClass('bigdata_inscripcion');
					}
					form.submit();
				}
			}
		},
		invalidHandler: function (event, validator) {
			// 'this' refers to the form
			var errors = validator.numberOfInvalids();
			var message = '';
			// var message = errors == 1
			// ? 'Ha faltado completar 1 campo. El campo se encuentra resaltado.'
			// : 'Ha faltado completar ' + errors + ' campos. Los campos se encuentran resaltados.';

			// if (errors == 1) {
			// 	message = itc._t('completar_1') +' 1 '+ itc._t('completar_2')
			// }else{
			// 	message = itc._t('completar_1') +' '+errors+' '+ itc._t('completar_2')
			// }

			if (itc.textoValidacionCompeltar) {
				message = itc.textoValidacionCompeltar;
			} else {
				message = itc._t('completar_1') + ' ' + errors + ' ' + itc._t('completar_2')
			}

			$('#navigation-example').prepend('<span>' + message + '</span>');
			jQuery('.collapse').collapse('show');
		}
	});

	/*
	* Recuperar clave
	*/
	$("#recuperarPass").click(function (h) {
		h.preventDefault();
		var recuperar = $("#recupeararCodigo").val();
		if (recuperar === "") {
			$("#aviso-recuperar").text(itc._t('recuperar_msg_correo_valido'));
		}
		else {
			$.ajax({
				url: "recuperar.php",
				type: "post",
				data: { email: recuperar, tipo: "codigo", idF: itc.id_formulario },
				success: function (t) {
					$("#aviso-recuperar").text(t);
				}
			});
		}
	});
	// return;


	/*
   * Si estÃ¡ en modo ediciÃ³n, debo ver si existe el campo "tipo" y "valor",
   * y asignarle la validaciÃ³n al campo "valor" segÃºin el tipo que tenga
   * (pendiente...)
   */
	$(".tipo_documentacion").each(function () {
		var actual = $(this);
		var tipoDoc = actual.val();
		if (tipoDoc !== "") {
			switch (tipoDoc) {
				case "{%DNI%}":

					var idDoc = actual.attr("id");
					var idVal = idDoc.substr(17);
					var ValorFinal = ((idVal * 1) + 1);
					$("#inputPrepand_" + (ValorFinal)).attr("alt", "{%DNI%}");
					$("#inputPrepand_" + (ValorFinal)).rules("remove");
					$("#inputPrepand_" + (ValorFinal)).rules("add", {
						dni: true,
						verificacionDNI: true
					});

					break;
				default:
					break;
			}
		}
	});

	/*
	* Editar Inscripcion
	* TO DO: Pasar respuestas a JSON
	*/
	$("#editarInscripcion").submit(function (e) {
		e.preventDefault();
		var usuario = $("#usuario").val();
		var clave = $("#clave").val();
		if (usuario === "" || clave === "") {
			// $("#infoDatos").text("Ingrese usuario y clave");
			$("#infoDatos").text(itc._t('editar_user_pass'));
		} else {
			$("#botonEditarInscripcion").text("Espere...");
			$("#botonEditarInscripcion").attr("disabled", true);
			$.ajax({
				url: itc.siteurl + "rest/v1/editarInscripcion",
				type: "post",
				data: $(this).serialize(),
				dataType: "JSON",
				success: function (datos) {
					console.log(datos);
					if (datos.success) {
						location.href = itc.siteurl + datos.urlredirect;
					} else {
						$("#infoDatos").text(datos.msg);
						$("#botonEditarInscripcion").attr("disabled", false);
						$("#botonEditarInscripcion").text("Ingresar");
					}
				}
			});
		}
	});

	/*
	* Login Dashboard
	*/
	$("#login").submit(function (e) {
		e.preventDefault();
		var usuario = $("#usuario").val();
		var clave = $("#clave").val();
		if (usuario === "" || clave === "") {
			// $("#infoDatos").text("Ingrese usuario y clave");
			$("#infoDatos").text(itc._t('editar_user_pass'));
		} else {
			$("#btn-login").text("Espere...");
			$("#btn-login").attr("disabled", true);
			$.ajax({
				url: itc.siteurl + "rest/v1/loginDashboard",
				type: "post",
				data: $(this).serialize(),
				dataType: "JSON",
				success: function (datos) {
					if (datos.success) {
						window.location.reload();
					} else {
						$("#infoDatos").text(datos.msg);
						$("#btn-login").attr("disabled", false);
						$("#btn-login").text("Ingresar");
					}
				},
				fail: function () {
					$("#btn-login").attr("disabled", false);
					$("#btn-login").text("Ingresar");
				}
			});
		}
	});

	//Fix for checkbox
	$('input[type="checkbox"]').on('click', function () {
		if ($(this).is(':checked')) {
			var idcampo = $(this).data('idcampo');
			$("label[for='campo[" + idcampo + "]']").remove();
		}
	});

	/*
	* validaciones personalizadas para jQuery Validate
	* Para CUIT
	*/

	jQuery.validator.addMethod("cuit", function (value, element) {
		var retorno = 0;
		var ret = true;
		retorno = this.optional(element) || /^\d{11}$/.test(value);
		if (!retorno)
			return retorno;

		ret = itc.validarCuit(value);
		if (ret && element.dataset.bna) {
			ret = itc.validarCuitBna(value);
		}
		return ret;
	}, itc._t('valida_cuit'));
	jQuery.validator.classRuleSettings.cuit = { cuit: true };

	/*
* Para CUIL
*/

	jQuery.validator.addMethod("cuil", function (value, element) {
		var retorno = 0;
		retorno = this.optional(element) || /^\d{11}$/.test(value);
		if (!retorno)
			return retorno;
		return itc.validarCuil(value);
	}, itc._t('valida_cuil'));
	jQuery.validator.classRuleSettings.cuit = { cuit: true };

	/*
	* Para DNI
	*/
	jQuery.validator.addMethod("dni", function (value, element) {
		// if(value.length > 4)
		// 	// $('.loading-img').show();
		// if (value.length > 6) {
		// 	// setTimeout(function(){
		// 	// 	$('.loading-img').hide();
		// 	// },3000);
		// }
		// return this.optional(element) || /^[0-9]\d?\.?\d{3}\.?\d{3}$/.test(value);
		return this.optional(element) || /^[\d]{1,2}\.?[\d]{3,3}\.?[\d]{3,3}$/.test(value);
	}, itc._t('valida_dni'));
	jQuery.validator.classRuleSettings.dni = { dni: true };

	/*
	* Para RUT
	*/
	jQuery.validator.addMethod("rut", function (value, element) {
		return this.optional(element) || /^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/.test(value);
	}, itc._t('valida_rut'));
	jQuery.validator.classRuleSettings.rut = { rut: true };

	/**
	 * Para Cedula de Ciudadania
	 */
	jQuery.validator.addMethod("cc", function (value, element) {
		return this.optional(element) || /^[1-9][0-9]*$/.test(value);
	}, itc._t('valida_rut'));
	jQuery.validator.classRuleSettings.rut = { cc: true };

	/**
	* Para Nombres
	*/
	$.validator.methods.names = function (value, element) {
		return this.optional(element) || !/[^a-zA-Z ]/.test(value);
	}

	/*
	* Verificar tiene codigo de descuento y si es valido
	*/
	jQuery.validator.addMethod("codigodescuento", function (value, element) {
		// clearTimeout (itc.timer);
		// itc.timer = setTimeout(function(){
		// debugger;
		let index = $(element).attr('id');
		value = value.replaceAll(/\s/g, '').toUpperCase();
		if (value.length == 0)
			return true;
		if (value.length < 5)
			return false;
		if (value == itc.codigodescuento.code && itc.codigoInvitado == null) {
			return itc.codigodescuento.state;
		}
		let cdant = '';
		let cdpermitido = true;
		$("[name=codigo_descuento\\[\\]]").each(function () {
			if (cdant == '') {
				cdant = $(this).val();
			} else if (cdant == $(this).val()) {
				$(this).parent().removeClass('has-success').addClass('has-error');
				cdpermitido = false;
			}
		});
		if (!cdpermitido) {
			//se encontraron dos o mas codigos iguales
			return false;
		}
		if (itc.codigoInvitado == null) idInscripcion = 0
		else idInscripcion = itc.id_inscripcion;

		$.ajax({
			url: itc.siteurl + "rest/v1/codigodescuento",
			type: "post",
			data: { code: value, idf: itc.id_formulario, idinscr: idInscripcion, _token: itc._token },
			dataType: "JSON",
			async: false,
			success: function (e) {
				$(element).val(value);
				// debugger;
				itc.codigodescuento.code = value;
				itc.codigodescuento.state = e.success;
				$('#tool_categorias').remove();
				if (e.data.deshab_categ == 1) {
					$('.cards .categoryselector').each(function (k, v) {
						var catid = $(this).data('catid');
						itc.disableCategoria($('#btncat_' + itc.id_moneda + '_' + catid), catid, itc.id_moneda);
						$('#btncat_' + itc.id_moneda + '_' + catid).attr('disabled', false);
					});
					/**/
				}
				if (e.success) {
					if (e.data.id_moneda > 0 && itc.id_moneda > 0 && (itc.id_moneda != e.data.id_moneda)) {
						$("[name=codigo_descuento\\[\\]]").parent().removeClass('has-success').addClass('has-error');
						$("div.codigodescuento").find('span.form-control-feedback').html('clear');
						$('[name="codigo_descuento\\[\\]"]').tooltip('destroy');
						//manejo error campo tipo cod. descuento
						$(".cod_descuento").parent().removeClass('has-success').addClass('has-error');
						$("div.campo_cod_descuento").find('span.form-control-feedback').html('clear');

						$('.porcen_descuento').html(parseFloat(0).formatMoney(2, ',', '.'));
						itc.codigodescuento.msg = e.msg;
						itc.codigodescuento.state = false;
						itc.resultado = false;
						return itc.resultado;
					}

					$("[name=codigo_descuento\\[\\]]").parent().removeClass('has-error').addClass('has-success');
					// $('[name="codigo_descuento"]').attr('readonly','readonly');
					$("div.codigodescuento").find('label').hide();
					$("div.codigodescuento").find('span.form-control-feedback').html('done');
					//manejo error campo tipo cod. descuento
					$(".cod_descuento").parent().removeClass('has-error').addClass('has-success');
					$("div.campo_cod_descuento").find('span.form-control-feedback').html('done');


					itc.resultado = true;
					var codedata = e.data;
					var porcentaje = parseFloat(codedata.porcentaje);
					itc.porcentajedescuento = porcentaje;
					itc.useasprice = codedata.useasprice;
					itc.categoriasdescuento = codedata.categorias;
					itc.codigodescuento.data[index] = e.data;
					if (porcentaje > 0) {
						$('.porcen_descuento').html(porcentaje.formatMoney(2, ',', '.'));
						if (!itc.useasprice) {
							$('.porcen_descuento_simb').html('%');
						} else if (typeof itc.monedas_formulario[itc.id_moneda] != 'undefined') {
							$('.porcen_descuento_simb').html(itc.monedas_formulario[itc.id_moneda].signo);
						} else if (typeof itc.monedas_formulario[codedata.id_moneda] != 'undefined') {
							$('.porcen_descuento_simb').html(itc.monedas_formulario[codedata.id_moneda].signo);
						}
					}
					var seleccionar_categoria = 0;
					// debugger;
					if (codedata.categorias) {
						if (e.data.deshab_categ == 1) {
							$('.cards .categoryselector').each(function (k, v) {
								var catid = $(this).data('catid');
								itc.disableCategoria($('#btncat_' + codedata.id_moneda + '_' + catid), catid, codedata.id_moneda);
								$('#btncat_' + codedata.id_moneda + '_' + catid).attr('disabled', true);

								if ($.inArray(catid.toString(), codedata.categorias) >= 0) {
									seleccionar_categoria = catid;
								}

							});
							/**/
						}
						$('[name="codigo_descuento"]').tooltip('destroy');
						// var html = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>';
						if (codedata.mostrardetalle == 1) {
							$('#tool_categorias_' + index).remove();
							var html = "<div id='tool_categorias_" + index + "' style='text-align:left;white-space:nowrap;'>El cÃ³digo aplica a:<br/>";
							$.each(codedata.nombrecategorias, function (k, v) {
								html += "<strong>" + k + "</strong><br><ul style='padding-left: 15px;'>";
								$.each(v, function (idcate, val) {
									html += "<li>" + val.categoria + "</li>";
									//habilita categorias
									if ($('#categoria_' + codedata.id_moneda + '_' + $(this).data('id_categ'))) {
										// itc.enableCategoria($('#btncat_' + codedata.id_moneda + '_' + idcate), idcate, codedata.id_moneda);
										$('#btncat_' + codedata.id_moneda + '_' + idcate).attr('disabled', false);
									}
								});
								html += "</ul>";




							});
							html += "</div>";
							$(element).parent('div').append(html);
						}
						if (e.data.deshab_categ == 1) {
							if (seleccionar_categoria > 0) {
								itc.enableCategoria($('#btncat_' + codedata.id_moneda + '_' + seleccionar_categoria), seleccionar_categoria, codedata.id_moneda);
							}
							/**/
						}
						// $('[name="codigo_descuento"]').tooltip({title:html,html:true});
						// $('[name="codigo_descuento"]').tooltip('show');
						// itc.codigodescuento.code = '';
					}
				} else {
					itc.resultado = false;
					$("[name=codigo_descuento\\[\\]]").parent().removeClass('has-success').addClass('has-error');
					$("div.codigodescuento").find('span.form-control-feedback').html('clear');
					$('[name="codigo_descuento"]').tooltip('destroy');
					//manejo error campo tipo cod. descuento
					// debugger
					$(".cod_descuento").parent().removeClass('has-success').addClass('has-error');
					$("div.campo_cod_descuento").find('span.form-control-feedback').html('clear');
					//prevenir categoria seleccionada si es por campo codigo de descuento
					$codDesc = $(".cod_descuento")[0];
					if ($codDesc && $codDesc.val() != '') {
						itc.clearCategorias();
					}


					$('.porcen_descuento').html(parseFloat(0).formatMoney(2, ',', '.'));
					itc._sett('msg_descuento', e.msg)
					itc.codigodescuento.msg = e.msg;
					itc.codigodescuento.state = false;
					itc.codigodescuento.code = '';
					$('#tool_categorias_' + index).remove();
					itc.codigodescuento.data[index] = {};
				}
				itc.calculeTotal();
				return itc.resultado;
			}
		});
		return itc.resultado;
	}, function (error, element) {
		return itc.codigodescuento.msg;
	});
	jQuery.validator.classRuleSettings.codigodescuento = { codigodescuento: true };



	/**/
	/*
	* Verificar email existente con jQuery Validator
	*/
	jQuery.validator.addMethod("existeEmail", function (value, element) {
		if (itc.invitado == "ok" || itc.validarEmail == 'false') {
			//No validar email si es edicion
			return true;
		}
		var resultadoEMAIL = false;
		if (itc.invitado == '' && $('[name="invitacion"]').val() != '') {
			itc.invitado = $('[name="invitacion"]').val();
		}
		// var aleatorio = jQuery('[name="invitacion"]').val();
		$.ajax({
			url: itc.siteurl + "rest/v1/verificarEmail",
			type: "get",
			async: false,
			data: { ema: value, idf: itc.id_formulario, invitacion: itc.invitado },
			dataType: "JSON",
			success: function (e) {
				if (e.success) { //Email valido, no existe
					resultadoEMAIL = true;
				} else {
					resultadoEMAIL = false;
				}
				return resultadoEMAIL;
			}
		});
		return resultadoEMAIL;
	}, itc._t('valida_email') + "<a href='javascript:void(0)' onclick='itc.recuperarDatos();'><b><i>" + itc._t('valida_email_link') + "</i></b></a>");
	jQuery.validator.classRuleSettings.existeEmail = { existeEmail: true };

	/*
	* Verificar Dni existente con jQuery Validate
	*/
	jQuery.validator.addMethod("verificacionDNI", function (value, element) {
		var tipoDocumento = element.alt; // El valor se guarda en el atributo ALT del input y lo obtengo acÃ¡
		if (value.length >= 4) {
			// $('.loading-img').show();
			$('.btn-chk').show();
			if (itc.habilitar_bigdata == false) {
				// $('.btn-bd').removeClass('label-info');
				// $('.btn-bd').css('background','');
				// $('.btn-bd').addClass('label-danger');
				// $('.btn-bd').text(itc._t('verificando'));
				// $('.btn-chk').css('display','initial');
			}
		}
		if (value.length < 6) {
			$('.btn-chk').hide();
			return true;
		}
		var resultadoDNI = true;
		var fieldRut = element.dataset.rut;

		if ((itc.invitado == '' || itc.invitado == 0) && $('[name="invitacion"]').val() != '') {
			itc.invitado = $('[name="invitacion"]').val();
		}

		$.ajax({
			url: itc.siteurl + "verificarDNI",
			type: "post",
			async: false,
			data: { _token: itc._token, dni: value, idf: itc.id_formulario, tipo: tipoDocumento, invitacion: itc.invitado, docactual: itc.datos_documento, fieldRut: fieldRut },
			dataType: "JSON",
			success: function (e) {
				// console.log(e)
				// $('.loading-img').hide();
				$('.btn-chk').hide();
				if (e.success) { //Email valido, no existe
					resultadoDNI = true;
					// $("#verificaEmail").focusout();
				} else {
					resultadoDNI = false;
				}


				if (itc.id_formulario == '1611' && typeof PGC == 'undefined') {
					itc.dataresultadoDNI = e;
					itc.habilitarCategorias();
				} else if (itc.id_formulario == '1656' && typeof PGC == 'undefined') {
					itc.dataresultadoDNI = e;
					itc.habilitarCategorias1656();
				} else if (itc.id_formulario == '1961' && typeof PGC == 'undefined') {
					itc.dataresultadoDNI = e;
					itc.habilitarCategorias1961();
				}


				return resultadoDNI;
			},
			complete: function () {
				// $('.loading-img').hide();
				// $('.btn-chk').hide();
			}
		});
		return resultadoDNI;
	}, itc._t('valida_dni_existe'));
	jQuery.validator.classRuleSettings.verificacionDNI = { verificacionDNI: true };

	/*
	* Verificar Dni existente con jQuery Validate
	*/
	jQuery.validator.addMethod("bigdataInfo", function (value, element) {
		var tipoValor = element.dataset.type;
		var dniId = $(element).attr('id');
		if (itc.esInvitacion == true) {
			return true;
		}
		if (tipoValor == 'dni') {
			if (value.length <= 7 || itc.searchingData) {
				return true;
			}
		}
		if (tipoValor == 'email') {
			var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			regex.test(value);
			if (regex.test(value) == false || itc.searchingData)
				return true;
		}
		$('.loading-img').show();
		itc.searchingData = true;
		var resultadoDNI = true;
		setTimeout(500);
		$.ajax({
			url: itc.siteurl + "rest/v1/checkInformation",
			type: "get",
			async: false,
			data: { value: value, valueType: tipoValor },
			dataType: "JSON",
			success: function (e) {
				if (e.success) {
					// console.log(e);
					emailBigData = e.data.data['campo3'];
					itc.inscrBigData = e.data;
					$('.infobigdata').html('<h4 class="text-info" style="letter-spacing: 2px; color: #31708f;font-weight: 600;margin-top: 0px;margin-bottom: 0px;">' + e.mail + '</h4>');
					//Email valido, no existe
					var html = '';

					for (a in itc.inscrBigData.eventData) {
						// debugger;

						evento = itc.inscrBigData.eventData[a];
						eventImg = itc.siteurl + 'storage/' + evento.imagen;
						onError = "this.onerror=null;this.src='https://www.intercloudy.net/img/CONTI_ico.jpg';";
						html += '<tr style="padding: 0;"><td class="text-center" style="width: 80px; padding: inherit;"><img src="' + eventImg + '" onError="' + onError + '" style="max-width:90px;max-height:45px;"></td><td style="width: 55%;">' + evento.nombreEvento + '</td><td style="padding: inherit;">' + evento.fecha + '</td></tr>';
						// 'https://www.intercloudy.net/img/apple-icon-72x72.png'
						// console.log(a);
					}
					// for (var i = 0; i < itc.inscrBigData.eventData.length; i++) {
					// 	evento = itc.inscrBigData.eventData[i];
					// 	eventImg = itc.siteurl + 'storage/' + evento.imagen;
					// 	onError ="this.onerror=null;this.src='https://www.intercloudy.net/img/CONTI_ico.jpg';";
					// 	html += '<tr style="padding: 0;"><td class="text-center" style="width: 80px; padding: inherit;"><img src="'+eventImg+'" onError="'+ onError +'" style="max-width:90px;max-height:45px;"></td><td style="width: 55%;">'+evento.nombreEvento+'</td><td style="padding: inherit;">'+evento.fecha+'</td></tr>';
					// 	'https://www.intercloudy.net/img/apple-icon-72x72.png'
					// }
					$('.eventTable').html(html);
					setTimeout(function () {

						// $('.btn-bd').text('BigData');
						// $('.btn-bd').removeClass('label-danger');
						// $('.btn-bd').addClass('label-info');
						// $('.btn-bd').css('background','#31708f');
						itc.habilitar_bigdata = true;
						$('.bigdata_inscripcion').modal('show');
					}, 000);

					$('.modalBigDataEmail').focus();
					resultadoDNI = true;
				} else {
					itc.searchingData = false;
					resultadoDNI = true;
				}
				return resultadoDNI;
			},
			complete: function () {
				$('.loading-img').hide();
				$('.btn-chk').hide();
				// setTimeout(function(){
				// 	$('.loading-img').hide();
				// },2000);

			}
		});
		return resultadoDNI;
	}, itc._t('bigdata_match'));
	jQuery.validator.classRuleSettings.bigdataInfo = { bigdataInfo: true };

	/*
	* Verificar API
	*/
	jQuery.validator.addMethod("api", function (value, element) {
		$(element).closest('div').removeClass('has-success').removeClass('has-error');
		var index = $(element).data('index');
		var id = element.id;



		// var resultadoAPI = true;
		// itc.resultadoAPI = itc.sendPromise(value,element).then(function(done) {
		// 	debugger;
		// 	return done;
		// });
		// debugger;
		// return itc.resultadoAPI;

		if (itc.valoranterior == value) {
			return itc.resultadoAPI;
		}
		$('#api-loading').addClass('noopacity').removeClass('siopacity');

		itc.valoranterior = value;

		var index = $(element).data('index');
		var id = element.id;

		$.ajax({
			url: itc.siteurl + "rest/v1/verificarCodigo",
			type: "post",
			async: false,
			data: { _token: itc._token, code: value, idf: itc.id_formulario, index: index, invitacion: itc.invitado },
			dataType: "JSON",
			success: function (e) {
				// debugger;
				itc.apiData = e.response;
				if (e.success) { //Email valido, no existe
					if (itc.invitado != '') { // es edicion, por lo tanto no debe validar nada
						itc.resultadoAPI = true;
						return true;
					}
					itc.checkEmailAPIInfo(e.response, element);
					itc.resultadoAPI = true;
				} else {
					$(element).closest('div').addClass('has-error').removeClass('has-success').find('i.material-icons').html('clear');
					// itc.alertISCT();
					itc.resultadoAPI = false;
				}
			},
			complete: function () {
				$('#api-loading').addClass('siopacity').removeClass('noopacity');
			}
		});

		return itc.resultadoAPI;

	}, itc._t('api_unmatch'));
	jQuery.validator.classRuleSettings.api = { api: true };

	/*
	* Verificar valida_inscripcion
	*/
	var ttt = 0;
	jQuery.validator.addMethod("valida_inscripcion", function (value, element) {
		// var index = $(element).data('index');
		// debugger;
		var id = element.id;

		if (itc.valoranterior == value) {
			return itc.valida_inscripcion;
		}
		$('.valida_inscripcion_img').show();

		itc.valoranterior = value;
		clearTimeout(ttt);
		// var index = $(element).data('index');
		// var id = element.id;
		ttt = setTimeout(function () {
			// debugger;
			$.ajax({
				url: itc.siteurl + "rest/v1/validarInscripcion",
				type: "post",
				async: false,
				data: { _token: itc._token, code: itc.valoranterior, idf: itc.id_formulario },
				dataType: "JSON",
				success: function (e) {
					// debugger;
					$('.valida_inscripcion_img').hide();
					itc.apiData = e.response;
					if (e.success && e.response.campo1 != '') {
						r = e.response;
						itc.valida_inscripcion = true;
						$('#' + id + '_result').val(r.campo2 + ' ' + r.campo1);
						$('#' + id + '_result').closest('div').removeClass('is-empty');
						$('#' + id + '_result').parent().addClass('has-success').removeClass('has-error').find('span.material-icons').html('check');
						$(element).parent().addClass('has-success').removeClass('has-error');
					} else {
						$('#' + id + '_result').val('');
						$('#' + id + '_result').parent().addClass('has-error').removeClass('has-success').find('span.material-icons').html('clear');
						itc.valida_inscripcion = false;
						$('#' + id + '_result').closest('div').addClass('is-empty');
					}
					$(element).focusout();
					return itc.valida_inscripcion;
				},
				complete: function () {
				}
			});

		}, 3000);


		return "pending";
		// return itc.valida_inscripcion;

	}, itc._t('api_unmatch'));
	jQuery.validator.classRuleSettings.valida_inscripcion = { valida_inscripcion: true };

	/*
	* Verificar Telefono
	*/
	jQuery.validator.addMethod("telefono", function (phone, element) {
		// return this.optional(element) || phone.length >= 6 || phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
		return this.optional(element) || (phone.match(/\d/g).length >= 6 && phone.match(/\d/g).length <= 20);
	}, itc._t('telefono_erroneo'));
	jQuery.validator.classRuleSettings.telefono = { telefono: true };

	jQuery.fn.delayKeyup = function (callback, ms) {
		var timer = 0;
		var el = $(this);
		$(this).keyup(function () {
			clearTimeout(timer);
			timer = setTimeout(function () {
				callback(el)
			}, ms);
		});
		return $(this);
	};
	/*
	* Agregar la clase SUBMIT al Ãºltimo paso del wizard
	*/
	var ultimoIdWizard = $("#paso_" + itc.ultimoPaso);
	ultimoIdWizard.addClass("submit");

	/*
	* Para el botÃ³n de "Editar formulario"
	*/
	$("#editar_form").click(function () {
		$("#datos_editar_form").slideToggle();
	});

	/*
	* select2
	*/
	$('#inputTags').select2({ tags: ["red", "green", "blue"] });
	var anchoi = $("body").width();
	if (anchoi > 600) {
		$('[data-form=select2]').select2();
	}

	$('[data-form=select2-group]').select2({ theme: "classic" });

	// this select2 on side right
	$('#tagsSelect').select2({
		tags: ["red", "green", "blue"],
		tokenSeparators: [",", " "]
	});

	/*
	* Setea las categorias basadas en el pais seleccionado
	*/
	// itc.setMonedaPais('');
	/*
	* datepicker
	*/
	$('[data-form=datepicker]').datepicker({
		language: "es"
	})
	itc.calculeTotal();

	$("#agregarColaboradores").submit(function (e) {
		e.preventDefault();
		var nombre = $("#colNombre").val();
		var apellido = $("#colApellido").val();
		var email = $("#colEmail").val();
		var campo_puesto = $("#colPuesto").val();
		var idForm = $("#idForm").val();
		var idInscripto = $("#idInscripto").val();
		var institucion = $("#colInstitucion").val();
		var gruposelected = $("#colPuesto").find(':selected').data('grupo');

		$.ajax({
			url: itc.siteurl + "rest/v1/agregarColaborador",
			type: 'PUT',
			dataType: 'json',
			data: { nombre: nombre, apellido: apellido, email: email, grupo: gruposelected, puesto: campo_puesto, institucion: institucion, idFormulario: idForm, idInscripto: idInscripto, _token: itc._token },
		})
			.done(function (data) {
				console.log(data);
				var pos = jQuery("table tbody tr:last td").data('pos') + 1;
				var idCol = data.id;
				jQuery("#agregarColaboradores").find("input[type=text], textarea").val("");
				html = '<tr id="pos' + pos + '"><td class="text-center" data-pos="' + pos + '">' + pos + '</td><td>';
				html += institucion + '</td><td>';
				html += campo_puesto;
				html += '</td><td>' + nombre;
				html += '</td><td>' + apellido;
				html += '</td><td class="text-right">' + email;
				html += '</td><td class="td-actions text-right">';
				html += '</button><button type="button" rel="tooltip" class="btn btn-danger" data-value="' + idCol + '" onclick="itc.borrarColaborador(' + idCol + ',' + pos + ')">';
				html += '<i class="material-icons">delete</i></button></td></tr>';
				$("table tbody").append(html);
				/* Manejo del Select2 */
				jQuery("#colPuesto option").each(function () {
					var thgr = $(this).data('grupo');
					console.log($(this).val(), data.puesto, thgr, gruposelected)
					if ($(this).val() == data.puesto && thgr == gruposelected) {
						$(this).data('disponible', data.cupoOcupado);
						agregargrupo = '';
						if (thgr != '')
							agregargrupo = '[' + thgr + '] ';
						if (data.cupoOcupado >= $(this).data('total')) {
							newOption = agregargrupo + $(this).val() + ' [' + data.cupoOcupado + '/' + $(this).data('total') + ']';
							if ($(this).prop("disabled") == false) {
								$(this).prop('disabled', true);
							}
						} else {
							newOption = agregargrupo + $(this).val() + ' [' + data.cupoOcupado + '/' + $(this).data('total') + ']';
						}
						$(this).text(newOption);
					}
				});
				jQuery('#colPuesto').val("").select2();
			})
			.fail(function (e) {
				console.log(e);
				itc._alertbox("No se pudo ingresar el colaborador");
			});

	});

	$("#cd-vertical-nav").css('z-index', 1);

	$("#cd-vertical-nav li a").hover(function (element) {
		jQuery('#cd-vertical-nav').css('z-index', 5);
	}, function (element) {
		jQuery('#cd-vertical-nav').css('z-index', 1);
	});

	var $input = $('input.file[type=file]');
	if ($input.length) {
		$input.fileinput({
			language: itc._t('locale'),
			maxFileSize: itc.maxFileSize,
		});
	}

	$('.cards').on('click', '.btnSeats', function (event) {

		cantidad = $('#' + $(this).data('cantidad')).val();
		dia = $(this).data('dia');
		tribuna = $(this).data('tribuna');
		id_group = $(this).data('id_group');
		id_categ = $(this).data('id_categ');
		idmon = $(this).data('idmon');
		id_categoria = $(this).data('id_categoria');

		windowSeats(cantidad, dia, tribuna, id_group, id_categ, idmon, id_categoria);

	});

	$('.selectButacas').on('change', function () {
		cantidad = $(this).val();
		dia = $(this).data('dia');
		tribuna = $(this).data('tribuna');
		id_group = $(this).data('id_group');
		id_categ = $(this).data('id_categ');
		idmon = $(this).data('idmon');
		id_categoria = $(this).data('id_categoria');

		windowSeats(cantidad, dia, tribuna, id_group, id_categ, idmon, id_categoria);
	});

	$('.card-click').on('click', function () {

		if ($(this).data('tribuna') == 'TORRONTES') {
			return;
		}

		if ($('#categoria_' + $(this).data('idmon') + '_' + $(this).data('id_categ')).prop('checked')) {
			itc.disableCategoria($('#btncat_' + $(this).data('idmon') + '_' + $(this).data('id_categ')), $(this).data('id_categ'), $(this).data('idmon'));
		} else {
			itc.enableCategoria($('#btncat_' + $(this).data('idmon') + '_' + $(this).data('id_categ')), $(this).data('id_categ'), $(this).data('idmon'));


			if (itc.getCantidadCategorias() > 0) {
				cantidad = $('#' + $(this).data('cantidad')).val();
				dia = $(this).data('dia');
				tribuna = $(this).data('tribuna');
				id_group = $(this).data('id_group');
				id_categ = $(this).data('id_categ');
				idmon = $(this).data('idmon');
				id_categoria = $(this).data('id_categoria');
				windowSeats(cantidad, dia, tribuna, id_group, id_categ, idmon, id_categoria);
			}
		}
	});

	$('#gestion_butacas').on('hidden.bs.modal', function (event) {
		event.preventDefault();
		jQuery('.imgSectores').attr('src', '');
		$('.ulButacas').children().remove();
		$('.ulButacas').append(selectorButacas);
		jQuery('.seatCharts-row').remove();
		jQuery('.seatCharts-legendItem').remove();
		jQuery('#modalbutacas').unbind().removeData().removeAttr('aria-activedescendant');
		$('#modalButacas').removeClass('seatCharts-container');
	});

	$('#gestion_butacas').on('shown.bs.modal', function (e) {
		if (itc.id_formulario == 1235) {
			$('.butacasSectores').trigger('click');
		}
	})

	$(document).on('click', '.butacasSectores', function () {
		$('.ulButacas>li').each(function () {
			$(this).removeClass('active');
		});

		var baseUrl = window.location.href.split("/");
		var url = baseUrl[0] + '//' + baseUrl[2] + '/storage/' + baseUrl[3] + '/';

		jQuery('.seatCharts-row').remove();
		jQuery('.seatCharts-legendItem').remove();
		jQuery('#modalbutacas').unbind().removeData().removeAttr('aria-activedescendant');
		$(this).parent().addClass('active');
		$('.butacasTitle').text('Seleccionar Butacas');
		$('#hiddenSector').val($(this).data('nro'));

		if (itc.selectedTribuna[0] == 'MALBEC') {
			if ($(this).data('nro') == 1) {
				jQuery('.imgSectores').attr('src', url + '69942_MALBEC_1.jpg');
			} else if ($(this).data('nro') == 2) {
				jQuery('.imgSectores').attr('src', url + '83670_MALBEC_2.jpg');
			} else if ($(this).data('nro') == 3) {
				jQuery('.imgSectores').attr('src', url + '80923_MALBEC_3.jpg');
			} else if ($(this).data('nro') == 4) {
				jQuery('.imgSectores').attr('src', url + '72646_MALBEC_4.jpg');
			} else if ($(this).data('nro') == 5) {
				jQuery('.imgSectores').attr('src', url + '7908_MALBEC_5.jpg');
			}
		} else if (itc.selectedTribuna[0] == 'SAUVIGNON') {
			if ($(this).data('nro') == 1) {
				jQuery('.imgSectores').attr('src', url + '38758_SAUVIGNON_1.jpg');
			}
		} else if (itc.selectedTribuna[0] == 'CHARDONNAY') {
			if ($(this).data('nro') == 1) {
				jQuery('.imgSectores').attr('src', url + '95981_CHARDONNAY_1.jpg');
			} else if ($(this).data('nro') == 2) {
				jQuery('.imgSectores').attr('src', url + '61500_CHARDONNAY_2.jpg');
			}
		} else if (itc.selectedTribuna[0] == 'TEMPRANILLO') {
			if ($(this).data('nro') == 1) {
				jQuery('.imgSectores').attr('src', url + '66546_TEMPRANILLO_1.jpg');
			} else if ($(this).data('nro') == 2) {
				jQuery('.imgSectores').attr('src', url + '49698_TEMPRANILLO_2.jpg');
			} else if ($(this).data('nro') == 3) {
				jQuery('.imgSectores').attr('src', url + '26738_TEMPRANILLO_3.jpg');
			} else if ($(this).data('nro') == 4) {
				jQuery('.imgSectores').attr('src', url + '93873_TEMPRANILLO_4.jpg');
			} else if ($(this).data('nro') == 5) {
				jQuery('.imgSectores').attr('src', url + '92369_TEMPRANILLO_5.jpg');
			}
		} else if (itc.selectedTribuna[0] == 'BONARDA') {
			if ($(this).data('nro') == 1) {
				jQuery('.imgSectores').attr('src', url + '57606_BONARDA_1.jpg');
			} else if ($(this).data('nro') == 2) {
				jQuery('.imgSectores').attr('src', url + '63290_BONARDA_2.jpg');
			} else if ($(this).data('nro') == 3) {
				jQuery('.imgSectores').attr('src', url + '11540_BONARDA_3.jpg');
			}
		} else if (itc.selectedTribuna[0] == 'ORO') {
			if ($(this).data('nro') == 1) {
				jQuery('.imgSectores').attr('src', url + 'oro_mini.jpg');
			}
		} else if (itc.selectedTribuna[0] == 'PLATA') {
			if ($(this).data('nro') == 1) {
				jQuery('.imgSectores').attr('src', url + 'plata_mini.jpg');
			}
		} else if (itc.selectedTribuna[0] == 'BRONCE') {
			if ($(this).data('nro') == 1) {
				jQuery('.imgSectores').attr('src', url + 'bronce_mini.jpg');
			}
		}

		var bloqueados = new Array();
		var sectorSeleccionado = $(this).data('nro');
		itc.sectores = tribunas[itc.selectedTribuna[0]];

		jQuery.each(itc.sectores, function (index, el) {
			jQuery.each(itc.butacasOcupadas, function (i, e) {
				if (e.noche == itc.selectedTribuna[2] && e.tribuna == itc.selectedTribuna[0] && e.sector == index) {
					itc.sectores[index].unavailable = e.butacas;
				}
			});
			itc.sectores[index].SetAside = [];
			jQuery.each(itc.butacasReservadas, function (i, e) {
				if (e.noche == itc.selectedTribuna[2] && e.tribuna == itc.selectedTribuna[0]) {
					if (e.sector == index) {
						if (e.sector == sectorSeleccionado) {
							itc.sectores[index].SetAside = e.butacas;
						}
					}
				}
			});
		});
		var butacasElegidas = itc.registerButacas($(this).data('nro'));
	});

	$('#confirmarButacas').click(function (event) {
		var email = $('#verificaEmail').val();
		var dia = itc.selectedTribuna[2];
		var tribuna = itc.selectedTribuna[0];
		var sector = $('#hiddenSector').val();
		var butacas = itc.sc.find('selected');
		var idGrupo = itc.selectedTribuna[3];
		var idCategoria = itc.selectedTribuna[4];
		var idButacasInsertadas = "";
		var precio = parseFloat($('#categoria_' + itc.selectedTribuna[6] + '_' + itc.selectedTribuna[4]).data('precio'));
		var texto = "";

		var idmon = $('#confirmarButacas').attr('idmon');
		var butacasSeleccionadas = itc.sc.find('selected');
		$('#cantidad_categorias_' + idmon + '_' + idCategoria).val(butacasSeleccionadas.length).trigger('change.select2');
		itc.selectedTribuna[1] = butacasSeleccionadas.length;

		// if (butacas.length == itc.selectedTribuna[1]){
		if (butacas.length > 0) {
			// if(confirm('Â¿Confirma las butacas elegidas?')){
			var butacasElegidas = new Array();
			var timeNow = Date.now();
			jQuery.each(butacas.seatIds, function (index, el) {
				butacasElegidas.push(el);
			});
			$('.ulButacas>li').each(function () {
				if ($(this).hasClass('active')) {
					// sector = $(this).find("a").data('nro');
				}
			});

			// itc.selectedTribuna[5] = 'SECTOR ' + sector + ' | BUTACAS: '
			itc.selectedTribuna[5] = '';
			$texto = [];
			$.each(butacasElegidas, function (index, el) {
				$seleccion = el.split('_');
				$texto = 'SECTOR: ' + sector + ' - BUTACA: ' + $seleccion[0] + '-' + $seleccion[1];
				if (butacasElegidas.length == index + 1) {
					itc.selectedTribuna[5] += $texto;
				} else {
					itc.selectedTribuna[5] += $texto + '<br>';
				}
			});

			var lid = 0;
			if (itc.lastInsertedId[idCategoria] != undefined)
				lid = itc.lastInsertedId[idCategoria];

			$.ajax({
				url: itc.siteurl + "rest/v1/reservarButacas",
				type: "GET",
				data: {
					id_formulario: itc.id_formulario
					, email: email
					, noche: dia
					, tribuna: tribuna
					, sector: sector
					, tribuna: tribuna
					, butacas: butacasElegidas
					, idGrupo: idGrupo
					, idCategoria: idCategoria
					, lastInsertedId: lid
					, _token: itc._token
				},
				dataType: "JSON",
				success: function (response) {

					if (response == 'NotAvailable') {
						alert('Â¡Los Lugares que selecciono ya se encuentra Ocupados! Por Favor Refresque la ventana!');
						return;
					}

					lastInsertedId = response;
					itc.lastInsertedId[idCategoria] = response;
					$('#labelButacas_' + itc.selectedTribuna[6] + '_' + itc.selectedTribuna[7]).html(itc.selectedTribuna[5]);
					//almacena el id temporal en cada categoria para borrarlo si se deselecciona
					$('[name="id_butaca_temp[' + idGrupo + '][' + idCategoria + ']"]').val(lastInsertedId);
					// var arrayButacas = [];
					if (itc.arrayButacas[idCategoria] == undefined)
						itc.arrayButacas[idCategoria] = [];

					if ($('#hiddenButacas').val() != '') {
						var hiddenButacas = $('#hiddenButacas').val();
					}
					itc.arrayButacas[idCategoria] = dia + ';' + tribuna + ';' + sector + ';' + itc.selectedTribuna[5] + ';' + precio + ';' + itc.selectedTribuna[1] + ';' + itc.calculeTotal();
					// if (itc.arrayButacas[idCategoria].length > 0) {
					// itc.arrayButacas[idCategoria].push('|' + dia + ';' + tribuna + ';' + sector + ';' + itc.selectedTribuna[5]+';'+precio+';'+itc.selectedTribuna[1]+';'+itc.calculeTotal());
					// }else{
					// itc.arrayButacas[idCategoria].push(dia + ';' + tribuna + ';' + sector + ';' + itc.selectedTribuna[5] + ';' + precio + ';' + itc.selectedTribuna[1] + ';' + itc.calculeTotal());
					// }
					console.log(itc.arrayButacas);
					var hiddenButacas = [];
					$.each(itc.arrayButacas, function (k, v) {
						hiddenButacas.push('|' + v);
					});
					$('#hiddenButacas').val(hiddenButacas);

					jQuery('#confirmarButacas').attr('disabled', 'disabled');

					$('.butacasTitle').text('Butacas');

					idButacasInsertadas = $('#idButacasInsertadas').val();
					if (idButacasInsertadas != '') {
						idButacasInsertadas = idButacasInsertadas + '|' + lastInsertedId;
					} else {
						idButacasInsertadas = lastInsertedId;
					}
					$('#idButacasInsertadas').val(idButacasInsertadas);
					if (response.error == 1) {
						alert(response.mensaje);
					}
					$('#gestion_butacas').modal('hide');
					$('#timerCounter').css('display', 'inline-block');
					if (flagTimer == true) {
						flagTimer = false;
					}
					startTimer();
				},
				error: function (response) {
					if (response == 'NotAvailable') {
						alert('Â¡Los Lugares que selecciono ya se encuentra Ocupados! Por Favor Refresque la ventana!');
						return;
					}
				}
			});


			// }
		}
	});

	$(".exitButacas").click(function () {
		$('#gestion_butacas').modal('hide');
	});

	$('.informeEfectivo').on('click', function () {
		$.ajax({
			url: itc.siteurl + "rest/v1/" + itc.id_formulario + '/getListToCrash',
			type: 'GET',
			data: {
				idFormulario: itc.id_formulario
				, _token: itc._token
			},
			dataType: 'JSON',
			success: function (response) {
				debugger;
			}

		});
	});

	$('#ft_tipoComprobante').on('change', function () {
		if ($('#ft_tipoComprobante').val() == 1) {
			if (!itc.esInvitacion) {
				$("#ft_TipoIdTributario").val("");
			}
			$("#ft_TipoIdTributario option[value='CUIT']").removeAttr("disabled");
			$("#ft_TipoIdTributario option[value='CUIL']").prop("disabled", true);
			$("#ft_TipoIdTributario option[value='DNI']").prop("disabled", true);
			// $("#ft_TipoIdTributario option[value='PASAPORTE']").prop("disabled", true);
			$('#ft_tipoComprobante').select2();
			$('#ft_TipoIdTributario').select2();
		} else if ($('#ft_tipoComprobante').val() == 6) {
			if (!itc.esInvitacion) {
				$("#ft_TipoIdTributario").val("");
			}
			$("#ft_TipoIdTributario option[value='CUIL']").removeAttr("disabled");
			$("#ft_TipoIdTributario option[value='DNI']").removeAttr("disabled");
			// $("#ft_TipoIdTributario option[value='PASAPORTE']").removeAttr("disabled");
			$("#ft_TipoIdTributario option[value='CUIT']").prop("disabled", true);
			$('#ft_tipoComprobante').select2();
			$('#ft_TipoIdTributario').select2();

		}
	});

	$('#ft_TipoIdTributario').on('change', function () {
		if ($(this).val() == 'CUIT') {
			$('#ft_NroIdTributario').rules("remove");
			$('#ft_NroIdTributario').rules("add", { cuit: true, messages: { cuit: 'Enter a valid CUIT' } });
		} else if ($(this).val() == 'DNI') {
			$('#ft_NroIdTributario').rules("remove");
			$('#ft_NroIdTributario').rules("add", { verificacionDNI: true, messages: { verificacionDNI: 'Enter a valid DNI' } });
		} else if ($(this).val() == 'CUIL') {
			$('#ft_NroIdTributario').rules("remove");
			$('#ft_NroIdTributario').rules("add", { cuil: true, messages: { cuil: 'Enter a valid CUIL' } });
		}
	});

	if (typeof itc.codigoInvitado != null) {
		$('[name="codigo_x_categoria"]').trigger('change');
	}
	if ($("[name=codigo_descuento\\[\\]]").val() != '') {
		$("[name=codigo_descuento\\[\\]]").blur();
	}

	$('.agreementCheckbox').click(function () {
		$('.summaryButton').attr('disabled', false);
		$('.agreementCheckbox').attr('disabled', true);

	});

	$('.modalBigDataEmail').keypress(function (e) {
		if (e.which == 13) {
			var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			var emailIngresado = $('.modalBigDataEmail').val();
			var validMail = regex.test(emailIngresado);
			var intentos = parseInt($('.attempt').html());

			if (validMail == true) {
				if (emailBigData == emailIngresado) {
					$('.modalBigDataEmail ~ span > i').text('done');
					$('.modalBigDataEmail').parent().addClass('has-success');
					$('.bigDataWarning').remove();
					$('.autoCompleteData').attr('disabled', false);
					$('.modalBigDataEmail').attr('disabled', true);
					$('.autoCompleteData').toggle(500);
				} else {
					$('.modalBigDataEmail ~ span > i').text('clear');
					$('.modalBigDataEmail').parent().addClass('has-error');
					intentos--;
				}
			} else {
				intentos--;
			}
			$('.attempt').html(intentos);
			if (intentos == 0) {
				$('.bigdata_inscripcion').modal('hide');
				$('.bigdata_inscripcion').removeClass('bigdata_inscripcion');
			}
		}
	});

	$('.autoCompleteData').click(function (event) {
		provincia = false;
		idPais = '';
		valorProvincia = '';
		id_inscr_valor = [];
		jQuery('[name*=campo]').each(function (i, e) {
			change = false;
			nombrecampo = $(this).siblings('label').first().text().replace(/\s/g, '');
			nombrecampo = nombrecampo.replace('*', '');

			if ($(this).data('cprincipal') < 6) {
				switch ($(this).data('cprincipal')) {
					case 1:
						$(this).val(itc.inscrBigData.data.campo1);
						change = true;
						break;
					case 2:
						$(this).val(itc.inscrBigData.data.campo2);
						change = true;
						break;
					case 3:
						$('#reemail_' + $(this).data('idcampo')).val(itc.inscrBigData.data.campo3);
						$('#reemail_' + $(this).data('idcampo')).parent().removeClass('is-empty');
						$(this).val(itc.inscrBigData.data.campo3);
						change = true;
						break;
					case 4:
						$(this).val(itc.inscrBigData.data.campo4);
						change = true;
						break;
					case 5:
						$(this).val(itc.inscrBigData.data.campo5);
						$(this).trigger('change').select();
						break;
					default:
					//code block
				}
			} else {
				// debugger;

				for (var i = 0; i < itc.inscrBigData.bigData.length; i++) {
					campo = itc.inscrBigData.bigData[i];
					if (campo.nombreCampo.replace(/\s/g, '').toLowerCase() == nombrecampo.toLowerCase()) {
						if (id_inscr_valor == 0 || campo.id_inscr_valor > id_inscr_valor[nombrecampo.toLowerCase()]) {
							id_inscr_valor[nombrecampo.toLowerCase()] = campo.id_inscr_valor;

							if (campo.nombreCampo.toLowerCase() == 'provincia') {
								if (campo.valor != 'Seleccione...') {
									valorProvincia = campo.valor;
									provincia = true;
									$('#' + idPais).data('selected', campo.valor);
								}

							} else if ($(this).data('form') == 'datepicker') {
								date = campo.valor.split('/');
								$('[data-form=datepicker]').datepicker('update', new Date(date[2], date[1], date[0]));
								$('[data-form=datepicker]').datepicker('hide');
							} else {
								$(this).val(campo.valor);
								if (nombrecampo.toLowerCase() == 'pais' || nombrecampo.toLowerCase() == 'paÃ­s') {
									idPais = $(this).attr('id');
								}
							}
							$(this).data('selected', campo.valor);
							change = true;
						}

					}
				}
			}
			if (change == true) $(this).parent().removeClass('is-empty');
			$('.bigdata_inscripcion').modal('hide');
			// $('.bigdata_inscripcion').removeClass('bigdata_inscripcion');
		});
		if (idPais != '' && provincia == true) {
			$('#' + idPais).data('selected', valorProvincia);
		}
		$('[data-form=select2]').trigger('change').select();
	});

	$('.modalBigDataEmail').parent().css('margin-top', '0px');
	$('.btn-bd').on('click', function (event) {
		event.preventDefault();
		$('.bigdata_inscripcion').modal('show');
	});

	$('.bigdata_inscripcion').on('hidden.bs.modal', function (event) {
		event.preventDefault();
		$('.btn-bd').css('display', 'initial');
	});

	$('.bg-cfm').on('click', function (event) {
		event.preventDefault();
		var e = $.Event("keypress", { which: 13 });
		$('.modalBigDataEmail').trigger(e);
	});

	$('.in-ty-em').on('keypress keyup blur flocus', function (event) {
		var email_regex = /[^a-zA-Z0-9@._-]/gi;
		var result = this.value.replace(email_regex, '');
		$(this).val(result);
	});

	//cd multiple
	$(".sumarcodigodescuento").click(function (h) {
		h.preventDefault();
		// $("[name=codigo_descuento\\[\\]]").clone().appendTo('.clonecd');
		// $(".clonecd").append($(".innercd").html())
		var cd = $('input[id^="code"]:last');
		var num = parseInt(cd.prop("id").match(/\d+/g), 10) + 1;
		var klon = cd.clone().prop('id', 'code' + num).prop('value', '');
		var html = $('<div class="form-group codigodescuento" style="margin:0;padding:0;"></div>').append(klon);
		$('.clonecd').append(html);
	});


	if (typeof MP != 'undefined') {
		MP.onReady();
	}
	if (itc.id_formulario == 1611) {
		$('#inputPrepand_10077879').focusin().focusout();
	}
	if (itc.id_formulario == 1656) {
		$('*[data-type="dni"]').focusin().focusout();
	}

	return;
	//End ready

});

function refrescarOcupadas() {
	$.ajax({
		url: itc.siteurl + "rest/v1/obtenerButacas",
		type: "GET",
		data: {
			idFormulario: itc.id_formulario
			, _token: itc._token
		},
		dataType: "JSON",
		success: function (response) {
			itc.butacasOcupadas = response;
			$('#gestion_butacas').modal('show');

			if (itc.id_formulario == 1235) {
				$('.butacasSectores').css('display', 'none');
			}
		}
	});
}

function windowSeats(cantidad, dia, tribuna, id_group, id_categ, idmon, id_categoria) {

	if (cantidad > 0 && itc.getCantidadCategorias() < itc.maximoCategoria + 1) {

		itc.selectedTribuna[0] = tribuna;
		itc.selectedTribuna[1] = cantidad = 4;
		itc.selectedTribuna[2] = dia;
		itc.selectedTribuna[3] = id_group;
		itc.selectedTribuna[4] = id_categ;
		itc.selectedTribuna[6] = idmon;
		itc.selectedTribuna[7] = id_categoria;



		$('#confirmarButacas').attr('idmon', idmon);

		itc.selectedTribuna[0] = itc.selectedTribuna[0].replace(/<[^>]*>?/g, '')
		$('.ulButacas').empty();
		if (itc.selectedTribuna[0] == 'BONARDA') {
			for (i = 0; i < 3; i++) {
				var $li = $('<li />').appendTo('.ulButacas');
				var nro = i + 1;
				if (i == 0) {
					var text = 'Sector ' + nro;
				} else {
					var text = 'Sector ' + nro;
				}

				$('<a />', {
					'href': "javascript:void(0);",
					'class': "butacasSectores",
					'data-nro': i + 1,
					'text': text
				}).appendTo($li);
			}
		} else if (itc.selectedTribuna[0] == 'CHARDONNAY') {
			for (i = 0; i < 2; i++) {
				var $li = $('<li />').appendTo('.ulButacas');
				var nro = i + 1;
				if (i == 0) {
					var text = 'Sector ' + nro;
				} else {
					var text = 'Sector ' + nro;
				}

				$('<a />', {
					'href': "javascript:void(0);",
					'class': "butacasSectores",
					'data-nro': i + 1,
					'text': text
				}).appendTo($li);
			}
		} else if (itc.selectedTribuna[0] == 'CABERNET SAUVIGNON') {
			itc.selectedTribuna[0] = 'SAUVIGNON';
			for (i = 0; i < 1; i++) {
				var $li = $('<li />').appendTo('.ulButacas');
				var nro = i + 1;
				if (i == 0) {
					var text = 'Sector ' + nro;
				} else {
					var text = 'Sector ' + nro;
				}

				$('<a />', {
					'href': "javascript:void(0);",
					'class': "butacasSectores",
					'data-nro': i + 1,
					'text': text
				}).appendTo($li);
			}
		} else if (itc.selectedTribuna[0] == 'ORO' || itc.selectedTribuna[0] == 'PLATA' || itc.selectedTribuna[0] == 'BRONCE') {
			itc.selectedTribuna[0] = tribuna;
			for (i = 0; i < 1; i++) {
				var $li = $('<li />').appendTo('.ulButacas');
				var nro = i + 1;
				if (i == 0) {
					var text = 'Sector ' + nro;
				} else {
					var text = 'Sector ' + nro;
				}

				$('<a />', {
					'href': "javascript:void(0);",
					'class': "butacasSectores",
					'data-nro': i + 1,
					'text': text
				}).appendTo($li);
			}
		} else if (itc.selectedTribuna[0] == 'TEMPRANILLO' || itc.selectedTribuna[0] == 'MALBEC') {
			for (i = 0; i < 5; i++) {
				var $li = $('<li />').appendTo('.ulButacas');
				var nro = i + 1;
				if (i == 0) {
					var text = 'Sector ' + nro;
				} else {
					var text = 'Sector ' + nro;
				}

				$('<a />', {
					'href': "javascript:void(0);",
					'class': "butacasSectores",
					'data-nro': i + 1,
					'text': text
				}).appendTo($li);
			}
		}


		/* FUNCION PARA ACTUALIZAR LAS BUTACAS QUE SE VAN OCUPANDO */
		refrescarOcupadas();



		jQuery('.seatCharts-row').remove();
		jQuery('.seatCharts-legendItem').remove();
		jQuery('#modalbutacas,#seat-map *').unbind().removeData().removeAttr('aria-activedescendant');
	}
}


function butacasBloqueadas(bloqueados) {
	var noDisponible = new Array();
	var nroButaca = 1;
	for (var i = 0; i < bloqueados.length; i++) {
		for (var x = 1; x <= bloqueados[i].butacas; x++) {
			noDisponible.push(bloqueados[i].fila + '_' + x);
		}
	}

	return noDisponible;
}
function startTimer() {


	if (flagTimer == false) {
		if (timerSet) {
			window.clearTimeout(timerSet);
		}
		if (itc.minTimer.toString().length < 2) {
			var timeLimite = '00:' + '0' + itc.minTimer + ':00';
		} else {
			var timeLimite = '00:' + itc.minTimer + ':00';
		}
		flagTimer = true;

	} else {
		var timeLimite = $('#countDownTimer').text();
	}

	var presentTime = timeLimite;
	var timeArray = presentTime.split(/[:]+/);
	var m = timeArray[1];
	var s = checkSecond(timeArray[2] - 1);
	if (s == 59) {
		m = m - 1;
	}

	if (m.toString().length < 2) {
		m = "0" + m;
	}

	if (m == 0 && s == 0) {
		flagTimer = false;
		lastInsertedId = $('#idButacasInsertadas').val();
		alert("Â¡Su selecciÃ³n de butacas a vencido!");
		$('#timerCounter').css('display', 'none');
		$.ajax({
			url: itc.siteurl + "rest/v1/deleteButacas",
			type: "GET",
			data: { lastInsertedId: lastInsertedId, _token: itc._token },
			dataType: "JSON",
			success: function (response) {
				$('#idButacasInsertadas').val('');
				if (response.error == 1) {
					console.log(response.mensaje);
				}
			}
		});

		return;
	}

	$('#countDownTimer').text("00:" + m + ":" + s);

	timerSet = window.setTimeout(startTimer, 1000);
}

function checkSecond(sec) {
	if (sec < 10 && sec >= 0) {
		sec = "0" + sec;
	}

	if (sec < 0) {
		sec = "59";
	}

	return sec;
}

function validarDatosFt(total) {
	// si no se cargo el validator o no tiene el bloque de facturacion habilitado
	if (itc.Formvalidator == null || typeof $('#ft_tipoComprobante').val() == 'undefined') {
		return;
	}

	if (parseFloat(total) > 0) {
		// $('#ft_tipoComprobante').data('validate',"{required: true,messages:{required:'The field is required.',required:'Enter a valid string'}}");
		$('#ft_tipoComprobante').rules("add", { required: true });
		$('input[name="ft_RazonSocial"]').rules("add", { required: true });
		$('input[name="ft_Domicilio"]').rules("add", { required: true });
		$('#ft_TipoIdTributario').rules("add", { required: true });
		$('input[name="ft_NroIdTributario"]').rules("add", { required: true });
		$('#ft_IVA').rules("add", { required: true });
	} else {
		$('#ft_tipoComprobante').rules("add", { required: false });
		$('input[name="ft_RazonSocial"]').rules("add", { required: false });
		$('input[name="ft_Domicilio"]').rules("add", { required: false });
		$('#ft_TipoIdTributario').rules("add", { required: false });
		$('input[name="ft_NroIdTributario"]').rules("add", { required: false });
		$('#ft_IVA').rules("add", { required: false });

		// $('#ft_tipoComprobante').rules();
		// $('input[name="ft_RazonSocial"]').rules("remove");
		// $('input[name="ft_Domicilio"]').rules("remove");
		// $('#ft_TipoIdTributario').rules("remove");
		// $('input[name="ft_NroIdTributario"]').rules("remove");
		// $('#ft_IVA').rules("remove");
	}
}

/*******************************************************************************************
 * nombre:   Arbol (tree,n-lista anidada)
 * descripciÃ³n: funciÃ³n necesaria del plugin js dhtmlxtree
 * licencia: Â©
 * requiere: dhtmlxtree script en javascript en ./t2/codebase
 * Autor: JEDGCC
 * Fecha: 19/5/2015
 * versiÃ³n: 0.1
			0.2  03.06.2015 (agregado de carga en modo ediciÃ³n formulario y agregado del label diferenciado para arbol y selecciÃ³n)
			0.3  10.07.2015 (agregada la funciÃ³n para obtener la ruta absoluta de un Ã­tem en el Ã¡rbol)
			0.4  28.06.2016 Transforado a clase objeto

********************************************************************************************/
var myTree;
var Arbol = {
	version: '0.3',
	g_ids_tree_formulario_editado: '',
	gsiconounidadmedida: 'leaf.gif', //no pregunto por el primer y segundo indice x qe ya preguntÃ© si tenÃ­a delimitador pipe
	gsiconohoja: 'leaf.gif',
	gsiconopadreultimahoja: 'folderOpen.gif',
	gsicononodoabierto: 'folderOpen.gif',
	gsicononodocerrado: 'folderClosed.gif',

	gsiconounidadmedida2: 'leaf.gif', //no pregunto por el primer y segundo indice x qe ya preguntÃ© si tenÃ­a delimitador pipe
	gsiconohoja2: 'leaf.gif',
	gsiconopadreultimahoja2: 'folderOpen.gif',
	gsicononodoabierto2: 'folderOpen.gif',
	gsicononodocerrado2: 'folderClosed.gif',
	TERMINADOR_ID_CANTIDAD: 'cant',

	arrpath: [],
	idCampo: 0,
	cextra_json: {},
	sopciones: '',

	doOnLoad: function () {
		myTree = new dhtmlXTreeObject('treeboxbox_tree', '100%', '100%', 0);
		myTree.setImagePath("../ctrlwa/t2/codebase/imgs/dhxtree_skyblue/");
		myTree.enableDragAndDrop(false);
		myTree.loadJSONObject({ id: 0, item: [{ id: 1, text: "Conti" }, { id: 2, text: "InterCloudy", item: [{ id: "21", text: "WEXP" }] }, { id: 3, text: "ITC" }] })

		this.carga_json_tree();

		myTree.attachEvent('onDblClick', function (id) { Arbol.evt_agregar(id) }) //debe ir despuÃ©s de la carga json

		// carga la lista cuando entra en modo ediciÃ³n
		this.carga_items_arbol_en_lista(this.g_ids_tree_formulario_editado);
	},

	evt_agregar: function (id) {
		//al hacer doble click sobre el item si es contenedor lo expande si es un item final lo agrega a la lista
		if (myTree.hasChildren(id)) {
			myTree.openItem(id);
		} else {
			this.agregar();
		}
	},

	carga_items_arbol_en_lista: function (ids) {
		if (ids) {
			var arr = ids.split('|');
			for (var i = 0; i < (arr.length - 1); i++) {
				var sid = arr[i];
				if (sid.indexOf('#') >= 0 && sid.indexOf(':') >= 0) { //comprueba si es un item unidad de medida y si tiene la cantidad asociada
					var arrcuantificador = sid.split(':')
					sid = arrcuantificador[0];
					var cantidad = arrcuantificador[1];
					var sidtxtcantidad = sid + this.TERMINADOR_ID_CANTIDAD;
				}
				svalor = cantidad;
				sitem = myTree.getItemText(sid);
				spadre = myTree.getItemText(myTree.getParentId(sid));
				this.actualizar_lista(spadre, sitem, sid, svalor);
				this.actualizar_campo();
			}
		}

	},

	rutaarbol: function (id, separador) {
		idp = myTree.getParentId(id);
		if (rutaarbol.c == undefined) {
			this.arrpath = [];
			rutaarbol.c = 1;
			rutaarbol.s = "";
			this.arrpath.push(myTree.getItemText(id));
		}
		if (idp == "") {
			if (!separador) {
				separador = 'â–¶';
			}
			var d = 0;
			for (var i = this.arrpath.length - 2; i >= 0; i--) {
				d++;
				if (d == 1) { // para que el primer delimitador sea un caracter distinto de la flechita
					delimitador = 'â—‰';
				} else {
					delimitador = separador;
				}
				rutaarbol.s = rutaarbol.s + delimitador + this.arrpath[i];
			}
			rutaarbol.c = undefined;
		} else {
			this.arrpath.push(myTree.getItemText(idp));
			this.rutaarbol(idp, separador);
		}
		return rutaarbol.s;
	},

	agregar: function () {
		sid = myTree.getSelectedItemId();
		sitem = myTree.getItemText(sid);
		if (!this.existe_item_en_lista(sid)) {
			if (!myTree.getSubItems(sid)) { //para q no agregue subcategorÃ­as en vez de Ã­tems
				//spadre=myTree.getItemText(myTree.getParentId(sid));
				spadre = rutaarbol(sid);
				this.actualizar_lista(spadre, sitem, sid);
				this.actualizar_campo();
			} else {
				alert("No puede agregar una subcategorÃ­a a la selecciÃ³n.\nDebe seleccionar un Ã­tem de una subcategorÃ­a");
			}
		} else {
			alert("Ya existe el Ã­tem Â«" + sitem + "Â» en la lista");
		}

	},

	actualizar_lista: function (padre, hijo, id, valor) {
		if (valor === undefined) {
			valor = '';
		}
		if (id.substr(-1, 1) == '#') {
			//agrega LI y el campo cuantificador input text
			svalidador = 'data-validate="{required: true,  messages:{required:\'El campo es requerido.\'},  messages:{required:\'Ingrese una cantidad valida.\'}}';
			$('#sortable').append('<li style="display:none;padding-left: 5px; margin-left: 0px;" class="itemseleccion"><a href="javascript:void(0);" title="Quitar este Ã­tem de la lista" class="itemDelete"><img src="img/remover.gif" class="img_remover" ></a><table style="width:170px;word-wrap:break-word;"><tr><td  style="   display:inline-block;word-wrap:break-word;  padding: 0px 4px; width: 230px;  padding-bottom: 0;     padding-top: 0;"><b>' + padre + '</b></td></tr></table><table><tr><td class="cuantizadortd"><input  ' + svalidador + ' type=text name="' + id + this.TERMINADOR_ID_CANTIDAD + '" id="' + id + this.TERMINADOR_ID_CANTIDAD + '" class="cuantizador" onblur="evt_actualizar_campo(this);"  value="' + valor + '" onkeydown="return Arbol.validarCuantificador(event); "></td><td class="cuantizadortd" style="  font-size:12px; font-weight: bold;display:inline-block;word-wrap:break-word;   padding-bottom: 0;     padding-top: 0;width:140px !important ">' + hijo + '</td></tr></table></li>');
		} else {
			//agrega LI
			$('#sortable').append('<li style="display:none;padding-left: 5px; margin-left: 0px;" class="itemseleccion"><a href="javascript:void(0);" title="Quitar este Ã­tem de la lista" class="itemDelete"><img src="img/remover.gif" class="img_remover" ></a><table style="width:170px;word-wrap:break-word;"><tr><td style=" display:inline-block;word-wrap:break-word;   padding: 0px 4px; width: 230px;   padding-bottom: 0;     padding-top: 0;"><b>' + padre + '</b></td></tr></table><table><tr><td class="cuantizadortd"></td><td class="cuantizadortd" style=" font-size:12px; font-weight: bold;  display: inline-block;  word-wrap:break-word; width: 175px !important; ">' + hijo + '</td></tr></table></li>');
		}
		$('#sortable li:last').attr('class', 'itemseleccion');
		$('#sortable li:last').attr('id', id);
		//document.getElementById.
		$('#sortable li:last').slideDown('slow', function () {
			v = document.getElementById('divseleccion').scrollTopMax;
			$('#divseleccion').animate({ scrollTop: v + "px" }, 500, function () { document.getElementById('divseleccion').scrollTop = 10000; });
		});

	},

	validarCuantificador: function (e) {
		return ((e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 46 || e.keyCode == 110 || e.keyCode == 8 || e.keyCode == 37 || e.keyCode == 39 || (e.keyCode >= 48 && e.keyCode <= 57));
	},

	evt_actualizar_campo: function (obj) {
		if (isNaN(obj.value)) {

			obj.value = parseFloat(obj.value);
		}
		this.actualizar_campo();
	},

	//comprueba si un id existe en la lista de seleccion
	existe_item_en_lista: function (id) {
		flag_existe = false;
		$('.itemseleccion').each(function () {
			//alert(this.id + ' - ' + id);
			if (this.id == id) {
				flag_existe = true;;
			}
		});
		return flag_existe;
	},

	quitar: function () {

	},

	actualizar_campo: function () {
		sids_seleccionados = "";
		$('.itemseleccion').each(function () {
			//ids_seleccionados.push(this.id )
			if (this.id.substr(-1, 1) == '#') {
				cantidad = document.getElementById(this.id + Arbol.TERMINADOR_ID_CANTIDAD).value;
				//guarda junto al id la cantidad
				sids_seleccionados += this.id + ':' + cantidad + '|';
			} else {
				sids_seleccionados += this.id + '|';
			}
		});
		$('#inputPrepand_' + this.idCampo).val(sids_seleccionados);
	},

	carga_json_tree: function () {
		myTree.deleteChildItems(0);
		myTree.loadJSONObject(this.cextra_json);
		this.tcargar_opciones();
		myTree.closeAllItems('2');
		myTree.openItem('2');
	},

	tcargar_opciones: function () {
		if (this.sopciones != '') {
			if (this.sopciones.indexOf('|') > 0) {
				arropciones = this.sopciones.split('|');
				//ej: imagen_unidad_medida.gif|imagen_hoja.gif|imagen_padre_ultima_hoja.gif|imagen_nodo_abierto.gif|imagen_nodo_cerrado.gif
				this.gsiconounidadmedida = (arropciones[0] != '') ? arropciones[0] : this.gsiconounidadmedida; //no pregunto por el primer y segundo indice x qe ya preguntÃ© si tenÃ­a delimitador pipe
				this.gsiconohoja = (arropciones[1] != '') ? arropciones[1] : this.gsiconohoja;
				this.gsiconopadreultimahoja = (arropciones.length >= 3 && arropciones[2] != '') ? arropciones[2] : this.gsiconopadreultimahoja;
				this.gsicononodoabierto = (arropciones.length >= 4 && arropciones[3] != '') ? arropciones[3] : this.gsicononodoabierto;
				this.gsicononodocerrado = (arropciones.length >= 5 && arropciones[4] != '') ? arropciones[4] : this.gsicononodocerrado;
				myTree.setStdImages(gsiconohoja, gsicononodoabierto, gsicononodocerrado);
				myTree.deleteChildItems(0); //requiere que se recargue toda la estructura Ã¡rbol para que muestre los Ã­conos configurados
				objJSONextra = this.cextra_json;
				myTree.loadJSONObject(objJSONextra);
				arrhojas = myTree.getAllLeafs().split(',');
				for (i = 0; i < arrhojas.length; i++) {
					if (arrhojas[i].substr(-1, 1) == '#') { //si el Ãºltimo caracter es numeral significa que es un item cuantificador
						//seteo img nodos hojas que son cuantificadores
						myTree.setItemImage2(arrhojas[i], this.gsiconounidadmedida, this.gsiconounidadmedida, this.gsiconounidadmedida);
						myTree.setItemImage2(myTree.getParentId(arrhojas[i]), this.gsiconopadreultimahoja, this.gsiconopadreultimahoja, this.gsiconopadreultimahoja);
					}
				}
			}
		} else { //reset
			this.gsiconounidadmedida = this.gsiconounidadmedida2;
			this.gsiconohoja = this.gsiconohoja2;
			this.gsiconopadreultimahoja = this.gsiconopadreultimahoja2;
			this.gsicononodoabierto = this.gsicononodoabierto2;
			this.gsicononodocerrado = this.gsicononodocerrado2;
		}
		//myTree.closeAllItems('2');
		//return false;
	}

}

// $(document).on("ready", function(){
//Borrar de la lista de elegidos
// $('#sortable').on('click', '.itemDelete', function() {
// $(this).closest('li').animate({
// width: '0px'
// }, {
// duration: 600,
// complete: function() {
// $(this).remove();
// Arbol.actualizar_campo();
// }
// });
// });

// $("#MyWizard").slideDown(500);



// });



Number.prototype.formatMoney = function (c, d, t) {
	var n = this,
		c = isNaN(c = Math.abs(c)) ? 2 : c,
		d = d == undefined ? "." : d,
		t = t == undefined ? "," : t,
		s = n < 0 ? "-" : "",
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}
// count objects
Object.size = function (obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};



//FIX TAB INDEX SELECT2
// jQuery(document).ready(function(a){var b=a(document.body),c=!1,d=!1;b.on("keydown",function(a){var b=a.keyCode?a.keyCode:a.which;16==b&&(c=!0)}),b.on("keyup",function(a){var b=a.keyCode?a.keyCode:a.which;16==b&&(c=!1)}),b.on("mousedown",function(b){d=!1,1!=a(b.target).is('[class*="select2"]')&&(d=!0)}),b.on("select2:opening",function(b){d=!1,a(b.target).attr("data-s2open",1)}),b.on("select2:closing",function(b){a(b.target).removeAttr("data-s2open")}),b.on("select2:close",function(b){var e=a(b.target);e.removeAttr("data-s2open");var f=e.closest("form"),g=f.has("[data-s2open]").length;if(0==g&&0==d){var h=f.find(":input:enabled:not([readonly], input:hidden, button:hidden, textarea:hidden)").not(function(){return a(this).parent().is(":hidden")}),i=null;if(a.each(h,function(b){var d=a(this);if(d.attr("id")==e.attr("id"))return i=c?h.eq(b-1):h.eq(b+1),!1}),null!==i){var j=i.siblings(".select2").length>0;j?i.select2("open"):i.focus()}}}),b.on("focus",".select2",function(b){var c=a(this).siblings("select");0==c.is("[disabled]")&&0==c.is("[data-s2open]")&&a(this).has(".select2-selection--single").length>0&&(c.attr("data-s2open",1),c.select2("open"))})});