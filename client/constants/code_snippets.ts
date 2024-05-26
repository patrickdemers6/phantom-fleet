import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import json from 'react-syntax-highlighter/dist/cjs/languages/hljs/json';
import shell from 'react-syntax-highlighter/dist/cjs/languages/hljs/shell';
import foundation from 'react-syntax-highlighter/dist/cjs/styles/hljs/foundation';
import python from 'react-syntax-highlighter/dist/cjs/languages/hljs/python';

interface CodeSnippet {
    registerLanguage: (language: string, code: any) => void;
}

export const registerLanguages = (syntaxHighlighter: CodeSnippet) => {
    syntaxHighlighter.registerLanguage('javascript', js);
    syntaxHighlighter.registerLanguage('json', json);
    syntaxHighlighter.registerLanguage('shell', shell);
    syntaxHighlighter.registerLanguage('python', python);
}

export const theme = foundation;

const baseUrl = 'http://localhost:8080';
const path = '/api/1/vehicles/fleet_telemetry_config'
export const sendFleetTelemetryConfig = [
    { name: 'cURL', codeSnippetLanguage: 'shell', content: `curl ${baseUrl}${path} \\
    --header 'Content-Type: application/json' \\
    --data '
    {
        "vins": ["TESLA000000000001"],
        "config": {
            "host": "telemetry.your-domain.com",
            "port": 443,
            "ca": "CA chain of fleet-telemetry server",
            "fields": {
                "Odometer": {
                    "interval_seconds": 10
                }
            }
        }
    }
    '`},
    { name: 'JavaScript', codeSnippetLanguage: 'javascript', content: `const BASE_URL = '${baseUrl}';

const setFleetTelemetryConfig = async (vins) => {
    const body = {
        vins,
        config: {
            host: "telemetry.your-domain.com",
            port: 443,
            ca: "CA chain of fleet-telemetry server",
            fields: {
                Odometer: {
                    // note: interval is ignored by phantom fleet right now
                    interval_seconds: 10,
                }
            }
        }
    };

    const response = await fetch(\`\${BASE_URL}${path}\`, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    
    if (response.ok) {
        console.log("success");
    } else {
        console.log(await response.text());
    }
}

setFleetTelemetryConfig(['TESLA000000000001']);`},
    {
        name: 'Python',
        codeSnippetLanguage: 'python',
        content: `import requests
BASE_URL = '${baseUrl}'

def set_fleet_telemetry_config(vins):
    headers = {
        'Content-Type': 'application/json',
    }

    data = {
        "vins": vins,
        "config": {
            "host": "telemetry.your-domain.com",
            "port": 443,
            "ca": "CA chain of fleet-telemetry server",
            "fields": {
                "Odometer": {
                    "interval_seconds": 10
                }
            }
        }
    }

    response = requests.post(BASE_URL + '${path}', json=data, headers=headers)

    if response.ok:
        print("Success")
    else:
        print(response.text)

set_fleet_telemetry_config(['TESLA000000000001'])`
    }
];


export const fleetTelemetryConfig = {
    codeSnippetLanguage: 'json',
    text: JSON.stringify({
            "host": "0.0.0.0",
            "port": 443,
            "log_level": "info",
            "json_log_enable": true,
            "namespace": "tesla_telemetry",
            "records": {
                "alerts": [
                    "logger"
                ],
                "errors": [
                    "logger"
                ],
                "V": [
                    "logger"
                ]
            },
            "tls": {
                "server_cert": "/path/to/your/server/ca",
                "server_key": "/path/to/your/server/cert",
                "ca_file": "/path/to/ca/from/step/1"
            }     
    }, null, 2)
}