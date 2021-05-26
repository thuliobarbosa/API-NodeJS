var idatual = 0;
var modalCadastro;
var modalAlerta;
var modalExcluir;

window.onload = function(e) {
  listar();
}

function listar() {
  var tab = document.getElementById("tabela");
  for (var i = tab.rows.length -1; i > 0; i--) {
    tab.deleteRow(i);
  }

  fetch("http://127.0.0.1:3333/veiculo", {method: "GET"})
  .then(response => response.json())
  .then(data => {
    for (const item of data ) {
      var tab = document.getElementById("tabela");
      var row = tab.insertRow(-1);
      row.insertCell(-1).innerHTML = item.idveiculo;
      row.insertCell(-1).innerHTML = item.placa;
      row.insertCell(-1).innerHTML = item.modelo;
      row.insertCell(-1).innerHTML = item.marca;
      row.insertCell(-1).innerHTML = item.ano;
      row.insertCell(-1).innerHTML = item.valor;
      row.insertCell(-1).innerHTML = "<button type='button' class='btn btn-primary' "
      + " onclick='alterar("+item.idveiculo+")'> "
      + " <i class='bi bi-pencil'></i></button>"
      + " <button type='button' class='btn btn-danger' "
      + " onclick='excluir("+item.idveiculo+")'> "
      + " <i class='bi bi-trash'></i></button>"
    }
  })
  .catch(error => console.log("Erro: " + error));
}

function novo() {
  idatual = 0;
  document.getElementById("txt_placa").value = "";
  document.getElementById("txt_modelo").value = "";
  document.getElementById("txt_marca").value = "";
  document.getElementById("txt_ano_fabricacao").value = "";
  document.getElementById("txt_valor").value = "";

  modalCadastro = new bootstrap.Modal(document.getElementById("modalCadastro"));
  modalCadastro.show();
}

function alterar(id) {

	var myHeaders = new Headers();
	    myHeaders.append("Accept", "application/json");
	    myHeaders.append("Content-Type", "application/json");

  idatual = id;
  modalCadastro = new bootstrap.Modal(document.getElementById("modalCadastro"));
  modalCadastro.show();

  fetch("http://127.0.0.1:3333/veiculo/" + idatual, {method: "GET", edirect: 'follow', headers: myHeaders})
    .then(response => response.json())
    .then(data => {
      document.getElementById("txt_placa").value = data.placa;
      document.getElementById("txt_modelo").value = data.modelo;
      document.getElementById("txt_marca").value = data.marca;
      document.getElementById("txt_ano_fabricacao").value = data.ano;
      document.getElementById("txt_valor").value = data.valor;
    })
    .catch(error => console.log('error', error));
}

function excluir(id) {
  idatual = id;
  document.getElementById("modalAlertaBody").style.backgroundColor = "#E0F2F1";
  document.getElementById("modalAlertaBody").innerHTML = "<h5>Confirma a exclusão?</5>"
  +  "<button type='button' class='btn btn-primary' onclick='excluirSim()'>Sim</botton>"
  +  "<button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Não</botton>"
  modalExcluir = new bootstrap.Modal(document.getElementById("modalAlerta"));
  modalExcluir.show();
}

function excluirSim() {

    fetch("http://127.0.0.1:3333/veiculo/" + idatual, {method: "DELETE"})
    .then(response => {
        const status = response.status;
        modalExcluir.hide();
        listar();
        if (status == 200) {
            mostrarAlerta("Registro excluído com sucesso!", true);
        } 
        else {
            mostrarAlerta("Falha ao excluir registro");
        }
   });
}

function salvar() {
  var v = {
    idveiculo: idatual,
    placa: document.getElementById("txt_placa").value,
    modelo: document.getElementById("txt_modelo").value,
    marca: document.getElementById("txt_marca").value,
    ano: document.getElementById("txt_ano_fabricacao").value,
    valor: document.getElementById("txt_valor").value
  }

  var json = JSON.stringify(v);

  var url;
  var metodo;
  
   var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

  if(idatual == 0) {
    url = "http://127.0.0.1:3333/veiculo";
    metodo = "POST";
  }
  else {
    url = "http://127.0.0.1:3333/veiculo/" + idatual;
    metodo = "PUT";
  }

  fetch(url, {method: metodo, body: json, edirect: 'follow', headers: myHeaders})
  .then(response => response.json())
  .then(result => {
        if (result.idveiculo > 0) {
            mostrarAlerta("Cadastro Efetuado com Sucesso", true);
            modalCadastro.hide();
            listar();
        } else {
            mostrarAlerta("Falha ao inserir dados", false);
        }
    });
}

function mostrarAlerta(msg, success) {
  if (success) {
    document.getElementById("modalAlertaBody").style.backgroundColor = "#E0F2F1";
  }
  else {
    document.getElementById("modalAlertaBody").style.backgroundColor = "#FFEBEE";
  }
  document.getElementById("modalAlertaBody").innerHTML = msg;
  modalAlerta = new bootstrap.Modal(document.getElementById("modalAlerta"));
  modalAlerta.show();
  window.setTimeout(function(){
    modalAlerta.hide();
  }, 3000);
}