import { render, screen } from '@testing-library/angular';
import { DashboardComponent } from './dashboard.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';
import { ScatterChartComponent } from '../scatter-chart/scatter-chart.component';
import { ChartInteractionService } from '../../services/chart-interaction.service';
import { BehaviorSubject } from 'rxjs';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

describe('Dashboard Integration Tests', () => {
    let chartInteractionService: ChartInteractionService;
    let selectedData: any;
    let chartUpdateSubject: BehaviorSubject<any>;

    const testDataSets = [
        {
            name: 'Basic Data',
            data: [
                { name: 'Category A', value: 100 },
                { name: 'Category B', value: 200 },
                { name: 'Category C', value: 300 }
            ]
        },
        {
            name: 'Zero Values',
            data: [
                { name: 'Category A', value: 0 },
                { name: 'Category B', value: 0 },
                { name: 'Category C', value: 0 }
            ]
        },
        {
            name: 'Large Values',
            data: [
                { name: 'Category A', value: 1000000 },
                { name: 'Category B', value: 2000000 },
                { name: 'Category C', value: 3000000 }
            ]
        }
    ];

    beforeEach(async () => {
        chartUpdateSubject = new BehaviorSubject(null);

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

        chartInteractionService.selectedData$.subscribe(data => {
            selectedData = data;
            chartUpdateSubject.next(data);
        });
    });

    describe('Visual Regression Tests', () => {
        testDataSets.forEach(({ name, data }) => {
            it(`should render correctly with ${name}`, async () => {
                chartInteractionService.updateSelectedData(data[0]);
                await new Promise(resolve => setTimeout(resolve, 100));

                const dashboard = screen.getByRole('main');
                expect(dashboard).toMatchImageSnapshot({
                    failureThreshold: 0.1,
                    failureThresholdType: 'percent',
                    customSnapshotIdentifier: `dashboard-${name.toLowerCase().replace(/\s+/g, '-')}`
                });
            });
        });
    });

    describe('Cross-Chart Interactions', () => {
        it('should highlight selected data across all charts', async () => {
            const testData = { name: 'Category A', value: 100 };

            chartInteractionService.updateSelectedData(testData);
            await new Promise(resolve => {
                chartUpdateSubject.subscribe(data => {
                    if (data) resolve(data);
                });
            });

            const dashboard = screen.getByRole('main');
            expect(dashboard).toMatchImageSnapshot({
                failureThreshold: 0.1,
                failureThresholdType: 'percent',
                customSnapshotIdentifier: 'dashboard-highlighted'
            });
        });

        it('should maintain selection state when switching between charts', async () => {
            const testData = { name: 'Category A', value: 100 };

            chartInteractionService.updateSelectedData(testData);
            await new Promise(resolve => setTimeout(resolve, 100));

            chartInteractionService.updateSelectedData(testData);
            await new Promise(resolve => setTimeout(resolve, 100));

            const dashboard = screen.getByRole('main');
            expect(dashboard).toMatchImageSnapshot({
                failureThreshold: 0.1,
                failureThresholdType: 'percent',
                customSnapshotIdentifier: 'dashboard-multi-selection'
            });
        });
    });

    describe('Responsive Behavior', () => {
        it('should handle window resize correctly', async () => {
            const dashboard = screen.getByRole('main');
            expect(dashboard).toMatchImageSnapshot({
                failureThreshold: 0.1,
                failureThresholdType: 'percent',
                customSnapshotIdentifier: 'dashboard-initial'
            });

            Object.defineProperty(window, 'innerWidth', { value: 800 });
            Object.defineProperty(window, 'innerHeight', { value: 600 });
            window.dispatchEvent(new Event('resize'));
            await new Promise(resolve => setTimeout(resolve, 100));

            expect(dashboard).toMatchImageSnapshot({
                failureThreshold: 0.1,
                failureThresholdType: 'percent',
                customSnapshotIdentifier: 'dashboard-resized'
            });
        });
    });

    describe('Data Updates', () => {
        it('should update all charts when data changes', async () => {
            const initialData = testDataSets[0].data[0];
            const updatedData = testDataSets[1].data[0];

            chartInteractionService.updateSelectedData(initialData);
            await new Promise(resolve => setTimeout(resolve, 100));

            const dashboard = screen.getByRole('main');
            expect(dashboard).toMatchImageSnapshot({
                failureThreshold: 0.1,
                failureThresholdType: 'percent',
                customSnapshotIdentifier: 'dashboard-initial-data'
            });

            chartInteractionService.updateSelectedData(updatedData);
            await new Promise(resolve => setTimeout(resolve, 100));

            expect(dashboard).toMatchImageSnapshot({
                failureThreshold: 0.1,
                failureThresholdType: 'percent',
                customSnapshotIdentifier: 'dashboard-updated-data'
            });
        });
    });


    // Example of comprehensive integration test
    /*  describe('Dashboard Integration Tests', () => {
         it('should handle all chart scenarios', async () => {
             // Test initial render
             expect(dashboard).toMatchImageSnapshot({
                 customSnapshotIdentifier: 'dashboard-initial'
             });
 
             // Test data selection
             chartInteractionService.updateSelectedData(testData);
             await waitForUpdate();
             expect(dashboard).toMatchImageSnapshot({
                 customSnapshotIdentifier: 'dashboard-selected'
             });
 
             // Test responsive behavior
             simulateResize();
             await waitForUpdate();
             expect(dashboard).toMatchImageSnapshot({
                 customSnapshotIdentifier: 'dashboard-responsive'
             });
         });
     }); */

    // One test file with clear scenarios
   /*  describe('Dashboard Scenarios', () => {
        const scenarios = [
            { name: 'initial', data: basicData },
            { name: 'selected', data: selectedData },
            { name: 'resized', data: basicData, resize: true }
        ];

        scenarios.forEach(scenario => {
            it(`should handle ${scenario.name} scenario`, async () => {
                setupScenario(scenario);
                await waitForUpdate();
                expect(dashboard).toMatchImageSnapshot({
                    customSnapshotIdentifier: `dashboard-${scenario.name}`
                });
            });
        });
    }); */

    // Easy to add new test cases
    /* describe('Dashboard Features', () => {
        it('should handle new feature', async () => {
            // Setup new feature
            setupNewFeature();

            // Take snapshot
            expect(dashboard).toMatchImageSnapshot({
                customSnapshotIdentifier: 'dashboard-new-feature'
            });
        });
    }); */
}); 