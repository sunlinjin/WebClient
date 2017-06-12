angular.module('proton.dashboard')
    .directive('selectVpn', ($rootScope, dashboardModel, gettextCatalog) => {

        const currencyMap = {
            EUR: '€',
            USD: '$',
            CHF: 'chf'
        };

        const formatTitle = ({ Title, Amount, Currency, Cycle }) => {
            const I18N_MONTH = gettextCatalog.getString('month', null, 'dashboard plan');
            return `${Title.replace('ProtonVPN', '').trim()} +(${Amount / 100 / Cycle} ${currencyMap[Currency]}/${I18N_MONTH})`;
        };

        const formatList = (map = {}) => {
            const list = Object.keys(map).map((key) => {
                const plan = map[key];
                plan.label = formatTitle(plan);
                return plan;
            });
            return [{ label: '------------' }].concat(list);
        };

        return {
            scope: {
                model: '=',
                plan: '='
            },
            templateUrl: 'templates/dashboard/selectVpn.tpl.html',
            link(scope) {
                const { monthly, yearly } = dashboardModel.get();
                scope.plans = {
                    1: formatList(monthly.vpn, true),
                    12: formatList(yearly.vpn)
                };

                const { Name } = scope.model.vpnOption || {};
                if (Name) {
                    if (scope.model.cycle === 12) {
                        return (scope.model.vpnOption = yearly.vpn[Name]);
                    }
                    return (scope.model.vpnOption = monthly.vpn[Name]);
                }

                // Default case on Load
                scope.model.vpnOption = scope.plans[scope.model.cycle][1];
            }
        };
    });
