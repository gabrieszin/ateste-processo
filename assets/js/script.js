"use strict";

import { SwalAlert, converterParaMesBRL, isEmpty, numero_e_digito, verificarCPF, zeroEsquerda } from './modulos/utilitarios.js'

(() => {
  
  try{
    pdf2htmlEX.defaultViewer = new pdf2htmlEX.Viewer({});
  }catch(error){}
  
  document.querySelectorAll('[data-recarrega-pagina]').forEach(botao => {
    botao.addEventListener('click', () => {
      window.location.reload();
    })
  })
  
  function atribuirLinks(){
    const linkElementos = document.querySelectorAll('[data-link]');
    
    linkElementos.forEach(link => {
      switch(link.dataset.link.toLowerCase().trim()){        
        case 'github-dev':
        link.href = 'https://github.com/gabrieszin';
        break;
        
        case 'github-projeto':
        link.href = 'https://github.com/gabrieszin/[nome-repositorio]';
        break;
      }
      
      link.setAttribute('rel', 'noopener noreferrer');
    })
  }
  
  function atribuirAcoes(){
    const acoes = document.querySelectorAll('[data-action]');
    
    acoes.forEach(acao => {
      switch(acao.dataset.action){
        case 'acao':
        break;
        
        case 'editar':
        try{
          $(acao).on('click', (event) => {
            event.preventDefault();
            // SwalAlert('alert', {icon: 'success', title:'Teste', comp:{text:'Isso é apenas um teste', timer:null}, confirmacao:null});
            document.querySelector('#modal-editar-informacoes').showModal();
            setTimeout(() => {
              document.querySelector('#modal-editar-informacoes').querySelectorAll('input')[0].focus();
            }, 0)
          })
        }catch(error){}
        break;
        
        case 'fechar-modal':
        $(acao).on('click', (event) => {
          event.preventDefault();
          (acao.closest('dialog')).close();
        })
        break;
        
        case 'formulario-editar-informacoes':
        $(acao).on('submit', (event) => {
          event.preventDefault();
          enviarFormulario();
          acao.closest('dialog').close();
        })
        break;
        
        case 'toggle-dados-bancarios':
        $(acao).on('input', (event) => {
          // event.preventDefault();
          if(acao.checked){
            $((acao.closest('[data-content="dados-conta"]')).querySelector('[data-content="dados-bancarios"]')).show(300);
            setTimeout(() => {
              (acao.closest('[data-content="dados-conta"]')).querySelector('[data-content="dados-bancarios"]').querySelectorAll('input')[0].focus();
            }, 500)
          }else{
            $((acao.closest('[data-content="dados-conta"]')).querySelector('[data-content="dados-bancarios"]')).hide(300);
          }
        })
        break;
        
        default:
        console.warn('A ação não foi implementada.')
        break;
      }
    })
  }
  
  const replicar = (quantidade, string, adicionar) => {
    if(typeof string == 'string' && quantidade > string.length){
      for(let i = string.length; i < quantidade; i++){
        string += adicionar;
      }
      return string;
    }else{
      return string;
    }
  }
  
  function atribuirMascaras(param, input){
    if(isEmpty(param) && isEmpty(input)){
      document.querySelectorAll('[data-mascara]').forEach(input => {
        switch(input.dataset.mascara.trim().toLowerCase()){
          case 'cpf':
          $(input).mask('000.000.000-00');
          $(input).on('input', (evento) => {
            if(verificarCPF(evento.target.value)){
              $(evento.target.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeOut(500);
            }else{
              $(evento.target.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeIn(500);
            }
          })
          break;
          
          case 'numero-contrato':
          $(input).mask('0.0000.0000000-0');
          break;
          
          case 'data':
          $(input).mask('00/00/0000');
          break;
          
          case 'agencia':
          $(input).mask('0000', {reverse: true});
          break;
          
          case 'operacao':
          $(input).mask('0000', {reverse: true});
          break;
          
          case 'conta':
          $(input).mask('000000000000-0', {reverse: true});
          break;
          
          case 'conta-vendedor':
          $(input).mask('000000000000-0', {reverse: true});
          break;
          
          case 'money':
          SimpleMaskMoney.setMask(input, {
            prefix: 'R$ ',
            fixed: true,
            fractionDigits: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
            cursor: 'end'
          });
          input.removeAttribute('maxlength');
          break;
          
          default:
          throw new Error('Ação não implementada para o link informado.');
          break;
        }
      })
    }else{
      switch(param.toLowerCase().trim()){
        case 'agencia':
        $(input).mask('0000', {reverse: true});
        break;
        
        case 'operacao':
        $(input).mask('0000', {reverse: true});
        break;
        
        case 'cpf':
        $(input).mask('000.000.000-00', {reverse: true});
        break;
        
        case 'numero-contrato':
        $(input).mask('0.0000.0000000-0', {reverse: true});
        break;
        
        case 'conta':
        $(input).mask('000000000000-0', {reverse: true});
        break;
      }
    }
  }
  
  function enviarFormulario(){
    const inputs_tratamento = ['cc_agencia', 'cc_operacao', 'cc_numero', 'cc_digito', 'cp_agencia', 'cp_operacao', 'cp_numero', 'cp_digito'];
    
    if(!$('[data-input="conta-corrente"]').is(':checked')){
      // $('[data-input="cc-agencia"]').val('');
      // $('[data-input="cc-operacao"]').val('');
      // $('[data-input="cc-numero"]').val('');
    }
    
    if(!$('[data-input="conta-poupanca"]').is(':checked')){
      // $('[data-input="cp-agencia"]').val('');
      // $('[data-input="cp-operacao"]').val('');
      // $('[data-input="cp-numero"]').val('');
    }
    
    $('[data-input]').each((index, element) => {
      // console.log(element.dataset.input, inputs_tratamento.includes(element.dataset.input))
      // console.log(element.tagName, element.type, element.dataset.input)
      if(element.tagName.toLowerCase() == 'input'){
        const tipo = element.type;
        const area = $(`sxs[refer=${element.dataset.input}]`);
        
        if(!isEmpty(tipo) && !isEmpty(area)){
          switch(tipo){
            case 'text':
            
            !isEmpty(element.value) ? area.text(`${element.value.toUpperCase().trim()}`) : area.text('');
            
            // if(isEmpty(element.value) && inputs_tratamento.includes(element.dataset.input)){
            if(inputs_tratamento.includes(element.dataset.input)){
              switch(element.dataset.input){
                case 'cc_agencia':
                case 'cp_agencia':
                // console.log(element.value.length)
                element.value.length <= 5 ? area.html(replicar(5, element.value, '&emsp;')) : '';
                element.value.length == 0 ? area.html(`&emsp;&emsp;&emsp;`) : '';
                break;
                
                case 'cc_operacao':
                case 'cp_operacao':
                // console.log(element.value.length)
                element.value.length <= 4 ? area.html(replicar(5, element.value, '&emsp;')) : '';
                element.value.length == 0 ? area.html(`&emsp;&emsp;&emsp;`) : '';
                break;
                
                case 'cc_numero':
                case 'cp_numero':
                
                const valor = element.value.replaceAll('-', '');
                // console.log(numero_e_digito(valor))
                element.value.length <= 14 ? area.html(replicar(14, numero_e_digito(valor).numero, '&emsp;')) : '';
                element.value.length == 0 ? area.html(`&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;`) : '';
                
                if(element.dataset.input == 'cc_numero'){
                  $('sxs[refer="cc_digito"]').text(numero_e_digito(valor).agencia);
                }else if(element.dataset.input == 'cp_numero'){
                  $('sxs[refer="cp_digito"]').text(numero_e_digito(valor).agencia);
                }
                break;
                
                case 'cc_digito':
                case 'cp_digito':
                // element.value.length < 1 ? area.html(``) : '';
                break;
              }
            }
            break;
            
            case 'date':
            const data = element.value;
            try{
              if(data.length == 10){
                const split = data.split('-');
                $('sxs[refer="data_ano"]').text(split[0].trim());
                $('sxs[refer="data_dia"]').text(split[2].trim());
                
                if(split[1][0] == '0'){
                  $('sxs[refer="data_mes_extenso"]').text((converterParaMesBRL(parseInt(split[1][1]) - 1)).toUpperCase());
                }else{
                  $('sxs[refer="data_mes_extenso"]').text((converterParaMesBRL(parseInt(split[1]) - 1)).toUpperCase());
                }
              }
            }catch(error){}
            break;
            
            case 'checkbox':
            case 'radio':
            element.checked ? area.text('X') : area.text('');
            break;
          }
        }
      }
    })
  }
  
  window.addEventListener("load", function () {
    $('.overlay').hide();
    atribuirLinks();
    atribuirAcoes();
    atribuirMascaras();
    
    $('input').each((index, input) => {
      input.setAttribute('autocomplete', 'off');
    })
    
    $('input[type=checkbox]').each((index, input) => {
      $(input).on('focus', (evento) => {
        $(input.closest('.form-group')).addClass('focus')
      })
      
      $(input).on('blur', (evento) => {
        $(input.closest('.form-group')).removeClass('focus')
      })
    })
    
    $('input[type=radio]').each((index, input) => {
      $(input).on('focus', (evento) => {
        $(input.closest('.form-group')).addClass('focus')
      })
      
      $(input).on('blur', (evento) => {
        $(input.closest('.form-group')).removeClass('focus')
      })
    })
    
    try{
      const moment = new Date();
      $('#data_assinatura').val(`${moment.getFullYear()}-${zeroEsquerda(2, moment.getMonth() + 1)}-${zeroEsquerda(2, moment.getDate())}`);
    }catch(error){};
    
    try{
      const url = new URLSearchParams(new URL(window.location).search);
      const parametros_insercao = new Array();
      const modalidades = ['CCNPMCMV', 'CCFGTS', 'CCSBPE', 'PROCOTISTA']
      
      document.querySelectorAll('sxs[refer]').forEach(sxs => {
        parametros_insercao.push(sxs.getAttribute('refer'));
      });
      
      if(!isEmpty(parametros_insercao) && url.size > 0){
        // console.log(parametros_insercao)
        parametros_insercao.forEach(parametro => {
          if(url.has(parametro) && !isEmpty(url.get(parametro))){
            const elemento = document.querySelector(`[data-input=${parametro}]`);
            const type = elemento.type;
            const parametros_para_tratar = ['CPF_1', 'CPF_2', 'n_contrato', 'cc_agencia', 'cc_operacao', 'cc_numero', 'cp_agencia', 'cp_operacao', 'cp_numero'];
            
            switch(type){
              case 'text':
              
              if(parametros_para_tratar.includes(parametro)){
                switch(parametro){
                  case 'CPF_1':
                  case 'CPF_2':
                  elemento.value = url.get(parametro).replaceAll('-', ' ').substr(0, 11);
                  atribuirMascaras('cpf', elemento);
                  if(verificarCPF(elemento.value)){
                    $(elemento.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeOut(500);
                  }else{
                    $(elemento.closest('.area-validation-CPF').querySelector('.icon-invalid-CPF')).fadeIn(500);
                  }
                  break;
                  
                  case 'n_contrato':
                  elemento.value = url.get(parametro).replaceAll('-', '').replaceAll('.', '').substr(0, 16);
                  atribuirMascaras('numero-contrato', elemento);
                  break;
                  
                  case 'cc_numero':
                  case 'cp_numero':
                  const valor = url.get(parametro).replaceAll('-', '').replaceAll('.', '');
                  elemento.value = (valor);
                  // console.log(numero_e_digito(url.get(parametro)))
                  atribuirMascaras('conta', elemento);
                  if(elemento.dataset.input == 'cc_numero'){
                    $('sxs[refer="cc_digito"]').text(numero_e_digito(valor).digito);
                    $('[data-e="dados-bancarios-conta-corrente"]').show(300);
                    document.querySelector('[data-input="conta_corrente"]').checked = true;
                  }else if(elemento.dataset.input == 'cp_numero'){
                    $('sxs[refer="cp_digito"]').text(numero_e_digito(valor).digito);
                    $('[data-e="dados-bancarios-conta-poupanca"]').show(300);
                    document.querySelector('[data-input="conta_poupanca"]').checked = true;
                  }
                  break;
                  
                  case 'cc_agencia':
                  case 'cp_agencia':
                  elemento.value = (url.get(parametro).replaceAll('-', '')).substr(0, 4);
                  atribuirMascaras('agencia', elemento);
                  break;
                  
                  case 'cc_operacao':
                  case 'cp_operacao':
                  elemento.value = url.get(parametro).replaceAll('-', '').substr(0, 4);
                  atribuirMascaras('operacao', elemento)
                  break;
                }
              }else{
                elemento.value = url.get(parametro).replaceAll('-', ' ');
              }
              break;
              
              case 'checkbox':
              case 'radio':
              elemento.checked = (url.get(parametro) == 'true');
              
              if(url.get(parametro) == 'true' || url.get(parametro) == true || url.get(parametro) == 'false' || url.get(parametro) == false && !isEmpty(url.get(parametro))){
              }
            }
          }
        })
        enviarFormulario();
      }
      
      if(!isEmpty(url.has('modalidade')) && modalidades.includes(url.get('modalidade'))){
        $(`sxs[refer=${url.get('modalidade')}]`).text('X');
        document.querySelector(`#${url.get('modalidade')}`).checked = true;
      }
      
    }catch(error){
      console.log('Ocorreu um erro ao tentar recuperar os dados da URL. Erro: %s', error);
    }
    
  });
  
  // document.querySelector('#modal-editar-informacoes').showModal();
  
  var antes_de_imprimir = function() {
    // console.log('Antes de imprimir...');
    $('#controle').hide();
  };
  
  var depois_de_imprimir = function() {
    // console.log('Depois de imprimir...');
    $('#controle').show();
  };
  
  if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function(mql) {
      if (mql.matches) {
        antes_de_imprimir();
      } else {
        depois_de_imprimir();
      }
    });
  }
  
  window.onbeforeprint = antes_de_imprimir();
  window.onafterprint = depois_de_imprimir();
  
  $('.btn-impressao').on('click', (event) => {
    event.preventDefault();
    window.print();
  })
  
  document.addEventListener('keyup', (evento) => {
    if(!isEmpty(evento.keyCode)){
      if(evento.keyCode == 45){
        //Ativar modal editar informações
        exibirModalEditarInformacoes();
      }
    }
  })
  
  function exibirModalEditarInformacoes(){
    document.querySelector('#modal-editar-informacoes').showModal();
    setTimeout(() => {
      document.querySelector('#modal-editar-informacoes').querySelectorAll('input')[0].focus();
    }, 0)
  }
  
})();