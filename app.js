const cards = document.getElementById('cards')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment() // fragmentcrea elementos
let carrito = {}
//variablkes nuevsas items
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content

document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
cards.addEventListener('click', e=>{
    // console.log(e)
    addCarrito(e)
})
items.addEventListener('click', e =>{
    btnAccion(e)
})

const btnAccion =  e =>{
    if(e.target.classList.contains('btn-success'))
    {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }if(e.target.classList.contains('btn-danger'))
    {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad - 1
        carrito[e.target.dataset.id] = {...producto}
        if(producto.cantidad===0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    localStorage.setItem('carrito', JSON.stringify(carrito))
    e.stopPropagation()
}

const pintarCarrito = () =>{
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.precio
        templateCarrito.querySelectorAll('td')[2].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('.btn-success').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if( Object.keys(carrito).length === 0){
        footer.innerHTML = `<th class="text-center" scope="row" colspan="6">Carrito Vacio</th>`
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () =>{
        carrito = {}
        localStorage.setItem('carrito', JSON.stringify(carrito))
        pintarCarrito()
    })
}

const addCarrito = param =>{
    if(param.target.classList.contains('btn-dark')){
        console.log(param.target)
        setCarrito(param.target.parentElement)
    }
    param.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarCards = data => {
    //console.log('datos en pintar card', data)
    data.forEach(producto => {
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        //abajo se clonan los cards para que cada dato del json tenga uno
        const clonar = templateCard.cloneNode(true)
        fragment.appendChild(clonar)
    })
    cards.appendChild(fragment)
}

const fetchData = async () => {
    try{
        const respuesta = await fetch('api.json')
        const data = await respuesta.json()
        pintarCards(data)
        //console.log(data)
    } catch(error){
        console.log(error)
    }
}
//funcion de alerta para el boton de comprar
/*
function alerta('click', e){
    addCarrito(e)
}
*/