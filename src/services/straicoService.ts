import { ClassAnalysis } from '@/types/classAnalysis';

const STRAICO_API_KEY = 'dR-V0csHwxpoaZsR608sLWMMoxzqeQonX4UWGCpUbkB8ljEBaZW';
const STRAICO_API_URL = 'https://api.straico.com/v1/prompt/completion';

interface StraicoResponse {
  data: {
    overall_price: {
      input: number;
      output: number;
      total: number;
    };
    overall_words: {
      input: number;
      output: number;
      total: number;
    };
    completions: {
      [key: string]: {
        completion: {
          id: string;
          provider: string;
          model: string;
          object: string;
          created: number;
          choices: Array<{
            logprobs: null;
            finish_reason: string;
            native_finish_reason: string;
            index: number;
            message: {
              role: string;
              content: string;
              refusal: null;
              reasoning: string;
            };
          }>;
          usage: {
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
          };
        };
        price: {
          input: number;
          output: number;
          total: number;
        };
        words: {
          input: number;
          output: number;
          total: number;
        };
      };
    };
  };
}

export const analyzeTranscript = async (transcript: string): Promise<ClassAnalysis> => {
  if (!transcript || transcript.trim().length === 0) {
    throw new Error('Transcript is empty');
  }

  const systemPrompt = `Eres un analista educativo experto en la Evaluación de Carácter Diagnóstico Formativa (ECDF) para docentes. Analiza la siguiente transcripción de clase y proporciona un análisis detallado basado en los criterios de evaluación ECDF. Enfócate en identificar aspectos clave de la práctica docente según los criterios establecidos. IMPORTANTE: Proporciona TODO el análisis en español.`;

  const userPrompt = `Por favor, analiza esta transcripción de clase y proporciona un análisis estructurado en el siguiente formato JSON, basado en los criterios de la Evaluación de Carácter Diagnóstico Formativa (ECDF):

{
  "resumen": {
    "tema": "string",
    "objetivos": "string",
    "duracion": "string",
    "participantes": "string"
  },
  "criterios_evaluacion": {
    "contexto_practica": {
      "comprension_contexto": {
        "nivel": "AVANZADO|SATISFACTORIO|MÍNIMO|INFERIOR",
        "evidencias": ["string"],
        "recomendaciones": ["string"]
      },
      "flexibilidad_practica": {
        "nivel": "AVANZADO|SATISFACTORIO|MÍNIMO|INFERIOR",
        "evidencias": ["string"],
        "recomendaciones": ["string"]
      },
      "vinculacion_familias": {
        "nivel": "AVANZADO|SATISFACTORIO|MÍNIMO|INFERIOR",
        "evidencias": ["string"],
        "recomendaciones": ["string"]
      }
    },
    "reflexion_planeacion": {
      "propositos_claros": {
        "nivel": "AVANZADO|SATISFACTORIO|MÍNIMO|INFERIOR",
        "evidencias": ["string"],
        "recomendaciones": ["string"]
      },
      "articulacion_contenidos": {
        "nivel": "AVANZADO|SATISFACTORIO|MÍNIMO|INFERIOR",
        "evidencias": ["string"],
        "recomendaciones": ["string"]
      },
      "organizacion_conocimiento": {
        "nivel": "AVANZADO|SATISFACTORIO|MÍNIMO|INFERIOR",
        "evidencias": ["string"],
        "recomendaciones": ["string"]
      }
    },
    "praxis_pedagogica": {
      "comunicacion_docente_estudiantes": {
        "nivel": "AVANZADO|SATISFACTORIO|MÍNIMO|INFERIOR",
        "evidencias": ["string"],
        "recomendaciones": ["string"]
      },
      "estrategias_participacion": {
        "nivel": "AVANZADO|SATISFACTORIO|MÍNIMO|INFERIOR",
        "evidencias": ["string"],
        "recomendaciones": ["string"]
      },
      "interes_estudiantes": {
        "nivel": "AVANZADO|SATISFACTORIO|MÍNIMO|INFERIOR",
        "evidencias": ["string"],
        "recomendaciones": ["string"]
      }
    },
    "ambiente_aula": {
      "clima_respeto": {
        "nivel": "AVANZADO|SATISFACTORIO|MÍNIMO|INFERIOR",
        "evidencias": ["string"],
        "recomendaciones": ["string"]
      },
      "toma_decisiones": {
        "nivel": "AVANZADO|SATISFACTORIO|MÍNIMO|INFERIOR",
        "evidencias": ["string"],
        "recomendaciones": ["string"]
      },
      "estructura_organizacion": {
        "nivel": "AVANZADO|SATISFACTORIO|MÍNIMO|INFERIOR",
        "evidencias": ["string"],
        "recomendaciones": ["string"]
      }
    }
  },
  "momentos_clave": [
    {
      "tiempo": "string",
      "tipo": "string",
      "descripcion": "string",
      "impacto": "string"
    }
  ],
  "participacion_estudiantes": {
    "nivel_participacion": "string",
    "tipos_interaccion": ["string"],
    "momentos_destacados": ["string"]
  },
  "areas_mejora": {
    "fortalezas": ["string"],
    "oportunidades": ["string"],
    "recomendaciones_generales": ["string"]
  }
}

Para cada criterio de evaluación, asigna un nivel según la descripción proporcionada en el ECDF y fundamenta tu evaluación con evidencias específicas de la transcripción. Las recomendaciones deben ser prácticas y orientadas a la mejora continua.

Transcripción a analizar:
${transcript}`;

  try {
    console.log('Starting transcript analysis...');
    console.log('Transcript length:', transcript.length);
    console.log('Sending request to Straico API...');
    
    const requestBody = {
      models: ["anthropic/claude-3.7-sonnet:thinking"],
      message: `${systemPrompt}\n\n${userPrompt}`,
      temperature: 0.7,
      max_tokens: 4000
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(STRAICO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAICO_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Straico API error response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`Straico API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data: StraicoResponse = await response.json();
    console.log('Received response from Straico API:', data);
    
    // Obtener el primer modelo de la respuesta
    const firstModelKey = Object.keys(data.data.completions)[0];
    const completion = data.data.completions[firstModelKey].completion;
    
    if (!completion.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from Straico API');
    }

    const analysisContent = completion.choices[0].message.content;
    console.log('Analysis content:', analysisContent);
    
    try {
      // Limpiar el contenido de los backticks de markdown
      const cleanContent = analysisContent.replace(/```json\n?|\n?```/g, '').trim();
      console.log('Cleaned content:', cleanContent);
      
      const analysis = JSON.parse(cleanContent);
      console.log('Successfully parsed analysis');
      
      // Retornar el análisis con la transcripción incluida
      return {
        transcript,
        ...analysis
      };
    } catch (parseError) {
      console.error('Error parsing analysis content:', parseError);
      console.error('Raw content:', analysisContent);
      throw new Error('Failed to parse analysis response');
    }
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze transcript: ${error.message}`);
    }
    throw new Error('Failed to analyze transcript: Unknown error');
  }
}; 