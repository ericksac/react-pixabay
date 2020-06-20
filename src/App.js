import React, { useState, useEffect } from 'react';
import Formulario from './components/Formulario'
import Listadoimagenes from './components/Listadoimagenes'

function App() {

  const [busqueda, guardarBusqueda] = useState('');
  const [imagenes, guardarImagenes] = useState([]);

  const [paginaactual, guardarPaginaActual] = useState(1);
  const [totalpaginas, guardarPaginas] = useState(1);

  useEffect(() => {
    const consultarApi = async () => {
      if (busqueda === '') return;

      const imagenesPorPagina = 30;
      const key = '16855767-ab288a0978bac7eea0d9d7fc3';
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaactual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);
      const calcularTotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);
      guardarPaginas(calcularTotalPaginas);

      //Mover la pantalla hacia arriba
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({behavior: 'smooth'})
    }
    consultarApi();
  }, [busqueda, paginaactual])

  //ir a pagina anterior
  const paginaAnterior = () => {
    const nuevaPagActual = paginaactual - 1;
    if (nuevaPagActual === 0) return;

    guardarPaginaActual(nuevaPagActual);
  }
  //ira a pagina siguiente
  const paginaSiguiente = () => {
    const nuevaPagActual = paginaactual + 1;
    if (nuevaPagActual > totalpaginas) return;

    guardarPaginaActual(nuevaPagActual);
  }

  return (
    <div className="container">
      <div className="jumbotron">
        <p className=" lead text-center"> Buscador de Imágenes</p>
        <Formulario
          guardarBusqueda={guardarBusqueda}
        />
      </div>
      <div className="row justify-content-center">
        <Listadoimagenes
          imagenes={imagenes}
        />
        {(paginaactual === 1) ? null
          :
          (<button type="button"
            className="btn btn-info mr-1"
            onClick={paginaAnterior} >
            &laquo; Anterior
          </button>)
        }
        {
          (paginaactual === totalpaginas) ? null
            :
            (<button type="button"
              className="btn btn-info mr-1"
              onClick={paginaSiguiente}>
              Siguiente &raquo;
            </button>)
        }

      </div>
    </div>
  );
}

export default App;
