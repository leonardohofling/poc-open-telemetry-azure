import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AzureMonitorOpenTelemetryOptions,
  useAzureMonitor,
} from '@azure/monitor-opentelemetry';
import { Resource } from '@opentelemetry/resources';
import {
  SEMATTRS_ENDUSER_ID,
  SEMATTRS_HTTP_CLIENT_IP,
  SEMRESATTRS_SERVICE_INSTANCE_ID,
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_NAMESPACE,
} from '@opentelemetry/semantic-conventions';
import {
  BatchSpanProcessor,
  ReadableSpan,
  SpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { metrics, Span, SpanKind, TraceFlags } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

async function bootstrap() {
  const customResource = Resource.EMPTY;

  customResource.attributes[SEMRESATTRS_SERVICE_NAME] = 'poc-open-telemetry';
  customResource.attributes[SEMRESATTRS_SERVICE_NAMESPACE] = 'dev';
  customResource.attributes[SEMRESATTRS_SERVICE_INSTANCE_ID] = 'dev-instance';

  const options: AzureMonitorOpenTelemetryOptions = {
    // Sampling could be configured here
    samplingRatio: 1,
    // Use custom Resource
    resource: customResource as any,
    instrumentationOptions: {
      // Custom HTTP Instrumentation Configuration
      http: { enabled: true },
      azureSdk: { enabled: true },
    },
    enableLiveMetrics: true,
  };
  //addSpanProcessor(options);
  //addOTLPExporter(options);
  useAzureMonitor(options);

  const app = await NestFactory.create(AppModule);

  // Get the meter for the "testMeter" namespace
  const meter = metrics.getMeter('testMeter');

  // Create a histogram metric
  const histogram = meter.createHistogram('histogram');

  // Record values to the histogram metric with different tags
  histogram.record(1, { testKey: 'testValue' });
  histogram.record(30, { testKey: 'testValue2' });
  histogram.record(100, { testKey2: 'testValue' });

  await app.listen(3000);
}


bootstrap();
