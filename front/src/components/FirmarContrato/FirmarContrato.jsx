import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import logo from '../../assets/simplificado_a_color.png';
import { getInscripcionById, firmarContrato } from '../../services/Inscripciones.service';
import {
  clientErrorHandler,
  clientSuccessHandler,
} from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';

const FirmarContrato = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sigCanvas = useRef();
  const [inscripcion, setInscripcion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const cargarInscripcion = async () => {
      try {
        const data = await getInscripcionById(id);
        
        if (data.firmado) {
          clientErrorHandler(ERROR_MESSAGES.CONTRATO_YA_FIRMADO);
          navigate('/');
          return;
        }
        
        setInscripcion(data);
      } catch (error) {
        clientErrorHandler(
          error?.response?.data?.message || ERROR_MESSAGES.ERROR_CARGAR_DATOS
        );
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    cargarInscripcion();
  }, [id, navigate]);

  const limpiarFirma = () => {
    sigCanvas.current.clear();
  };

  const handleSubmit = async () => {
    if (sigCanvas.current.isEmpty()) {
      clientErrorHandler(ERROR_MESSAGES.FIRMA_REQUERIDA);
      return;
    }

    setSubmitting(true);
    try {
      const firmaBase64 = sigCanvas.current.toDataURL();
      await firmarContrato(id, firmaBase64);
      clientSuccessHandler(SUCCESS_MESSAGES.CONTRATO_FIRMADO);
      navigate('/');
    } catch (error) {
      clientErrorHandler(
        error?.response?.data?.message || ERROR_MESSAGES.ERROR_FIRMAR_CONTRATO
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg
          fill="currentColor"
          className="w-12 h-12 text-blue-600 animate-spin"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
            <animateTransform
              attributeName="transform"
              type="rotate"
              dur="0.75s"
              values="0 12 12;360 12 12"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <div className="flex flex-col justify-center mx-auto items-center gap-3 pb-6">
        <img src={logo} alt="Logo" width="60" />
        <h2 className="text-2xl font-bold text-gray-800">Firma de Contrato de Inscripción</h2>
      </div>

      {inscripcion && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-bold text-lg mb-2">Datos de la Inscripción</h3>
          <p><strong>Alumno:</strong> {inscripcion.alumno?.name}</p>
          <p><strong>Curso:</strong> {inscripcion.comision?.name}</p>
          <p><strong>Fecha de Registro:</strong> {new Date(inscripcion.fechaRegistro).toLocaleDateString('es-AR')}</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">Por favor, firma en el recuadro:</h3>
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              className: 'w-full h-64 bg-white',
            }}
            backgroundColor="white"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={limpiarFirma}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg px-5 py-2.5"
        >
          Limpiar Firma
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 btnAz font-medium rounded-lg px-5 py-2.5 disabled:opacity-50"
        >
          {submitting ? 'Enviando...' : 'Firmar y Enviar'}
        </button>
      </div>
    </div>
  );
};

export default FirmarContrato;
