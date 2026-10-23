$ErrorActionPreference = 'Stop'

function Invoke-CheckedCommand {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    & $Name @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$Name failed with exit code $LASTEXITCODE."
    }
}

$root = Split-Path -Parent $PSScriptRoot
$manifestNames = @(
    '00-namespace.yaml',
    '10-config.yaml',
    '20-postgres.yaml',
    '25-gcs.yaml',
    '30-backend.yaml',
    '40-frontend.yaml'
)
$manifestPaths = $manifestNames | ForEach-Object {
    Join-Path $PSScriptRoot $_
}

$missingManifests = $manifestPaths | Where-Object { -not (Test-Path $_ -PathType Leaf) }
if ($missingManifests) {
    throw "Missing Kubernetes manifest(s): $($missingManifests -join ', '). Add the team's manifests under k8s/ before deploying."
}

foreach ($command in @('minikube', 'kubectl')) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        throw "Required command '$command' was not found. Install it and ensure it is on PATH."
    }
}

Push-Location $root
try {
    Invoke-CheckedCommand -Name 'minikube' -Arguments @('start')
    Invoke-CheckedCommand -Name 'minikube' -Arguments @(
        'image', 'build', '-t', 'crytto-backend:latest', (Join-Path $root 'backend')
    )
    Invoke-CheckedCommand -Name 'minikube' -Arguments @(
        'image', 'build', '-t', 'crytto-frontend:latest', $root
    )

    foreach ($manifestPath in $manifestPaths) {
        Invoke-CheckedCommand -Name 'kubectl' -Arguments @('apply', '-f', $manifestPath)
    }

    foreach ($deployment in @('postgres', 'gcs', 'backend', 'frontend')) {
        Invoke-CheckedCommand -Name 'kubectl' -Arguments @(
            'rollout', 'status', "deployment/$deployment", '-n', 'crytto', '--timeout=180s'
        )
    }

    Write-Host 'Deployment is ready. To open the frontend, run: minikube service frontend -n crytto --url'
}
finally {
    Pop-Location
}
