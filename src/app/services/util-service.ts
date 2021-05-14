import { of } from 'rxjs';
import * as moment from 'moment';

export class UtilService {

    static readonly mediaSets = {
        xs: 320,
        sm: 768,
        md: 992,
        lg: 1200,
    };


    static getMedia(): string {
        const vw = document.documentElement.clientWidth;
        if (vw >= this.mediaSets.xs && vw < this.mediaSets.sm) {
            return 'xs';
        }
        if (vw >= this.mediaSets.sm && vw < this.mediaSets.md) {
            return 'sm';
        }
        if (vw >= this.mediaSets.md && vw < this.mediaSets.lg) {
            return 'md';
        }
        if (vw >= this.mediaSets.md) {
            return 'lg';
        }
    }

    static convertTimeToAmPm(time): string {
        return moment(time, ['hh:mm:ss']).format('hh:mm A');
    }

    static subtractMinutesFromTime(time, minToSubtract): string {
        return moment(time, ['hh:mm A']).subtract(minToSubtract, 'm').format('hh:mm A');
    }

    static getBusinessActiveDays(businessData): string[] {
        const businessActiveDays = [];
        if (businessData.Sun) {
            businessActiveDays.push({weekIndex: 0, weekString: 'Sun'});
        }
        if (businessData.Mon) {
            businessActiveDays.push({weekIndex: 1, weekString: 'Mon'});
        }
        if (businessData.Tue) {
            businessActiveDays.push({weekIndex: 2, weekString: 'Tue'});
        }
        if (businessData.Wed) {
            businessActiveDays.push({weekIndex: 3, weekString: 'Wed'});
        }
        if (businessData.Thu) {
            businessActiveDays.push({weekIndex: 4, weekString: 'Thu'});
        }
        if (businessData.Fri) {
            businessActiveDays.push({weekIndex: 5, weekString: 'Fri'});
        }
        if (businessData.Sat) {
            businessActiveDays.push({weekIndex: 6, weekString: 'Sat'});
        }
        return businessActiveDays;
    }


    /*
    Usage -
    one = moment("1:30 PM", ["hh:mm A"]);
    two = moment("1:29 PM", ["hh:mm A"])
    one.diff(two, 'minutes', true); // 1
    */
    static timeDifferenceInMins(a, now): number {
        const momentA = moment(a, ['hh:mm A']);
        const momentNow = moment(now, ['hh:mm A']);
        return momentA.diff(momentNow, 'minutes', true);
    }

}
