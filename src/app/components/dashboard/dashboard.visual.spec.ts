import { render, screen } from '@testing-library/angular';
import { DashboardComponent } from './dashboard.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';
import { ScatterChartComponent } from '../scatter-chart/scatter-chart.component';
import { ChartInteractionService } from '../../services/chart-interaction.service';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

// Helper functions for common test operations
const waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 100));

const simulateResize = (width = 800, height = 600) => {
    Object.defineProperty(window, 'innerWidth', { value: width });
    Object.defineProperty(window, 'innerHeight', { value: height });
    window.dispatchEvent(new Event('resize'));
};

describe('Dashboard Visual Integration Tests', () => {
    let chartInteractionService: ChartInteractionService;
    let dashboard: HTMLElement;

    // Test data scenarios
    const testScenarios = {
        basic: [
            { name: 'Category A', value: 100 },
            { name: 'Category B', value: 200 },
            { name: 'Category C', value: 300 }
        ],
        zero: [
            { name: 'Category A', value: 0 },
            { name: 'Category B', value: 0 },
            { name: 'Category C', value: 0 }
        ],
        large: [
            { name: 'Category A', value: 1000000 },
            { name: 'Category B', value: 2000000 },
            { name: 'Category C', value: 3000000 }
        ]
    };

    beforeEach(async () => {
        const { fixture } = await render(DashboardComponent, {
            imports: [
                BarChartComponent,
                LineChartComponent,
                PieChartComponent,
                DoughnutChartComponent,
                ScatterChartComponent
            ],
            providers: [ChartInteractionService]
        });

        chartInteractionService = fixture.debugElement.injector.get(ChartInteractionService);
        dashboard = screen.getByRole('main');
    });

    describe('Initial Render States', () => {
        it('should render dashboard with basic data', async () => {
            await waitForUpdate();
            expect(dashboard).toMatchImageSnapshot({
                customSnapshotIdentifier: 'dashboard-initial-basic',
                failureThreshold: 0.1,
                failureThresholdType: 'percent'
            });
        });

        it('should render dashboard with zero values', async () => {
            chartInteractionService.updateSelectedData(testScenarios.zero[0]);
            await waitForUpdate();
            expect(dashboard).toMatchImageSnapshot({
                customSnapshotIdentifier: 'dashboard-initial-zero',
                failureThreshold: 0.1,
                failureThresholdType: 'percent'
            });
        });

        it('should render dashboard with large values', async () => {
            chartInteractionService.updateSelectedData(testScenarios.large[0]);
            await waitForUpdate();
            expect(dashboard).toMatchImageSnapshot({
                customSnapshotIdentifier: 'dashboard-initial-large',
                failureThreshold: 0.1,
                failureThresholdType: 'percent'
            });
        });
    });

    describe('Interactive States', () => {
        it('should show selected state for all charts', async () => {
            // Select data in each chart
            testScenarios.basic.forEach(data => {
                chartInteractionService.updateSelectedData(data);
            });
            await waitForUpdate();

            expect(dashboard).toMatchImageSnapshot({
                customSnapshotIdentifier: 'dashboard-selected-all',
                failureThreshold: 0.1,
                failureThresholdType: 'percent'
            });
        });

        it('should handle multiple selections', async () => {
            // Select multiple items
            chartInteractionService.updateSelectedData(testScenarios.basic[0]);
            await waitForUpdate();
            chartInteractionService.updateSelectedData(testScenarios.basic[1]);
            await waitForUpdate();

            expect(dashboard).toMatchImageSnapshot({
                customSnapshotIdentifier: 'dashboard-multi-selection',
                failureThreshold: 0.1,
                failureThresholdType: 'percent'
            });
        });
    });

    describe('Responsive Behavior', () => {
        it('should adapt to different screen sizes', async () => {
            // Desktop size
            simulateResize(1920, 1080);
            await waitForUpdate();
            expect(dashboard).toMatchImageSnapshot({
                customSnapshotIdentifier: 'dashboard-desktop',
                failureThreshold: 0.1,
                failureThresholdType: 'percent'
            });

            // Tablet size
            simulateResize(1024, 768);
            await waitForUpdate();
            expect(dashboard).toMatchImageSnapshot({
                customSnapshotIdentifier: 'dashboard-tablet',
                failureThreshold: 0.1,
                failureThresholdType: 'percent'
            });

            // Mobile size
            simulateResize(375, 667);
            await waitForUpdate();
            expect(dashboard).toMatchImageSnapshot({
                customSnapshotIdentifier: 'dashboard-mobile',
                failureThreshold: 0.1,
                failureThresholdType: 'percent'
            });
        });
    });

    describe('Data Updates', () => {
        it('should handle data transitions', async () => {
            // Initial state
            await waitForUpdate();
            expect(dashboard).toMatchImageSnapshot({
                customSnapshotIdentifier: 'dashboard-transition-initial',
                failureThreshold: 0.1,
                failureThresholdType: 'percent'
            });

            // Update to zero values
            chartInteractionService.updateSelectedData(testScenarios.zero[0]);
            await waitForUpdate();
            expect(dashboard).toMatchImageSnapshot({
                customSnapshotIdentifier: 'dashboard-transition-zero',
                failureThreshold: 0.1,
                failureThresholdType: 'percent'
            });

            // Update to large values
            chartInteractionService.updateSelectedData(testScenarios.large[0]);
            await waitForUpdate();
            expect(dashboard).toMatchImageSnapshot({
                customSnapshotIdentifier: 'dashboard-transition-large',
                failureThreshold: 0.1,
                failureThresholdType: 'percent'
            });
        });
    });
}); 