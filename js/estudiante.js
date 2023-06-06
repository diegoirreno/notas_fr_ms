let banEstudiante = -1;

$(document).ready(function () {
    mostrarEstudiantes();
});

function mostrarEstudiantes() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:8000/verEstudiantes'
    }).done((response) => {
        const dataJson = JSON.parse(response);
        const usuarios = dataJson.data;
        const table = document.getElementById('estudiantesTb');
        const tbody = table.getElementsByTagName('tbody')[0];
        let html = '';

        usuarios.forEach(estudiante => {
            html += '<tr>';
            html += '   <td>' + estudiante.codigo + '</td>';
            html += '   <td>' + estudiante.nombres + '</td>';
            html += '   <td>' + estudiante.apellidos + '</td>';
            html += '   <td>';
            html += '      <button onclick="modificar(' + estudiante.codigo + ')">Modificar</button>';
            html += '   </td>';
            html += '   <td>';
            html += '      <button onclick="eliminar(' + estudiante.codigo + ')">Eliminar</button>';
            html += '   </td>';
            html += '   <td>';
            html += '      <a href="actividad.html">Notas</a>';
            html += '   </td>';
            html += '</tr>';
        });

        tbody.innerHTML = html;
    }).fail((error) => {
        console.error(error);
    });
}

document.getElementById('registrar').addEventListener('click', () => {
    banEstudiante = 0;
    document.getElementById('tituloModal').innerText = 'Registrar';
});


document.getElementById('guardar').addEventListener('click', () => {
    let formulario = document.forms['formularioEstudiante'];
    let codigo = formulario['codigo'].value;
    let nombres = formulario['nombres'].value;
    let apellidos = formulario['apellidos'].value;

    if (codigo && nombres && apellidos) {
        if (banEstudiante == 0) {
            $.ajax({
                url: 'http://localhost:8000/agregarEstudiantes',
                method: 'post',
                data: {
                    codigo: codigo,
                    nombres: nombres,
                    apellidos: apellidos
                }
            }).done(response => {
                const dataJson = JSON.parse(response);
                const msg = dataJson.data;
                alert(msg);
                mostrarEstudiantes();
                location.reload();
            });
        } else if (banEstudiante == 1) {
            let formularioModificar = document.forms['formularioEstudiante'];
            let nombresModificar = formularioModificar['nombres'].value;
            let apellidosModificar = formularioModificar['apellidos'].value;
            $.ajax({
                url: 'http://localhost:8000/actualizarEstudiantes/' + codigo ,
                method: 'put',
                data: {
                    nombres: nombresModificar,
                    apellidos: apellidosModificar
                }
            
            }).done(response => {
                const dataJson = JSON.parse(response);
                const msg = dataJson.data;
                alert(msg);
                mostrarEstudiantes();
                location.reload();
            });
        }
    } else {
        alert('No pueden haber campos vacios');
    }
});

function modificar(estuCodigo) {
    document.getElementById('tituloModal').innerText = 'Modificar';
    banEstudiante = 1;
    codigo = estuCodigo;
}

function eliminar(codigo) {
    $.ajax({
        url: 'http://localhost:8000/eliminarEstudiantes/' + codigo,
        method: 'delete',
    }).done(response => {
        const dataJson = JSON.parse(response);
        const msg = dataJson.data;
        alert(msg);
        mostrarEstudiantes();
        location.reload();

    });
}
