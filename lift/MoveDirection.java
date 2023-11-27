package lift;

/**
 * @author flowerwine
 * @date 2023 年 11 月 24 日
 */
public enum MoveDirection {
    /**
     * 正在向上移动
     */
    UP,
    /**
     * 正在向下移动
     */
    DOWN,
    /**
     * 停止, 也指无任务, 处于空闲状态
     */
    STOP;

    static boolean isMoveUp(MoveDirection moveDirection) {
        return UP.equals(moveDirection);
    }

    static boolean isMoveDown(MoveDirection moveDirection) {
        return DOWN.equals(moveDirection);
    }

    static boolean isMoveStop(MoveDirection moveDirection) {
        return STOP.equals(moveDirection);
    }
}
