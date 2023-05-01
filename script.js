const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items;

btnNew.onclick = async () => {
  if (descItem.value === "" || amount.value === "" || type.value === "") {
    return alert("Preencha todos os campos!");
  }

  await setItensBD(descItem.value, amount.value, type.value);

  loadItens();

  descItem.value = "";
  amount.value = "";
};

async function deleteItem(id) {
  let url = 'http://127.0.0.1:5000/transacao?id=' + id;
  await fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
  loadItens();
}

function insertItem(item) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.descricao}</td>
    <td>R$ ${item.valor}</td>
    <td class="columnType">${
      item.tipo === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
      <button onclick="deleteItem(${item.id})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

async function loadItens() {
  items = await getItensBD();
  tbody.innerHTML = "";
  items.forEach((item) => {
    insertItem(item);
  });

  getTotals(items);
}

function getTotals(items) {
  
  const amountIncomes = items
    .filter((item) => item.tipo === "Entrada")
    .map((transaction) => Number(transaction.valor));

  const amountExpenses = items
    .filter((item) => item.tipo === "Saída")
    .map((transaction) => Number(transaction.valor));

  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

const getItensBD = async () => {
  let url = 'http://127.0.0.1:5000/transacao';
    const response = fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        return data.transacao
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      return await response
}

const setItensBD = async (descricao,valor,tipo) =>{
  const formData = new FormData();
    formData.append('descricao', descricao);
    formData.append('valor', valor);  
    formData.append('tipo', tipo);  
    let url = 'http://127.0.0.1:5000/transacao';
    await fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
}

loadItens();
